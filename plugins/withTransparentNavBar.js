const { withAndroidStyles, withMainActivity } = require("@expo/config-plugins");

// ─── Fix styles.xml ───────────────────────────────────────────────
const withNavBarStyles = (config) => {
  return withAndroidStyles(config, (mod) => {
    const styles = mod.modResults;

    const addOrUpdateItem = (styleItems, name, value) => {
      const existing = styleItems.find((item) => item.$?.name === name);
      if (existing) {
        existing._ = value;
        // Remove tools:targetApi attribute if present
        if (existing.$?.["tools:targetApi"]) {
          delete existing.$["tools:targetApi"];
        }
      } else {
        styleItems.push({ $: { name }, _: value });
      }
    };

    const appTheme = styles.resources.style?.find(
      (s) => s.$?.name === "AppTheme",
    );

    if (appTheme && appTheme.item) {
      // Change enforceNavigationBarContrast to false instead of removing
      addOrUpdateItem(
        appTheme.item,
        "android:enforceNavigationBarContrast",
        "false",
      );
      addOrUpdateItem(
        appTheme.item,
        "android:navigationBarColor",
        "@android:color/transparent",
      );
      addOrUpdateItem(
        appTheme.item,
        "android:windowDrawsSystemBarBackgrounds",
        "true",
      );
      addOrUpdateItem(
        appTheme.item,
        "android:windowTranslucentNavigation",
        "true",
      );
      addOrUpdateItem(
        appTheme.item,
        "android:windowBackground",
        "@color/splashscreen_background",
      );
    }

    return mod;
  });
};

// ─── Fix MainActivity.kt ──────────────────────────────────────────
const withNavBarMainActivity = (config) => {
  return withMainActivity(config, (mod) => {
    let contents = mod.modResults.contents;

    // Add imports if not already present
    if (!contents.includes("import android.graphics.Color")) {
      contents = contents.replace(
        "import android.os.Build",
        "import android.graphics.Color\nimport android.os.Build",
      );
    }

    // Add nav bar fix inside onCreate after super.onCreate(null)
    if (!contents.includes("window.navigationBarColor = Color.TRANSPARENT")) {
      contents = contents.replace(
        "super.onCreate(null)",
        `super.onCreate(null)

    // Force transparent navigation bar
    window.navigationBarColor = Color.TRANSPARENT
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      window.isNavigationBarContrastEnforced = false
    }`,
      );
    }

    mod.modResults.contents = contents;
    return mod;
  });
};

// ─── Export combined plugin ───────────────────────────────────────
module.exports = (config) => {
  config = withNavBarStyles(config);
  config = withNavBarMainActivity(config);
  return config;
};
