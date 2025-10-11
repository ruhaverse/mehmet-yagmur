# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# Keep React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep JS related classes
-keepclassmembers class fqcn.of.javascript.interface.for.webview {
   public *;
}

# React Native Vector Icons
-keep class com.oblador.vectoricons.** { *; }

# Keep application class
-keep class com.shareuptime.MainApplication { *; }
-keep class com.shareuptime.MainActivity { *; }

# Don't obfuscate
-dontobfuscate

# Keep line numbers for debugging stack traces
-keepattributes SourceFile,LineNumberTable

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
-keepclassmembers class fqcn.of.javascript.interface.for.webview {
   public *;
}

# Keep native methods
-keepclasseswithmembers class * {
    native <methods>;
}