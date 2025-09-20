import 'package:flutter/material.dart';

class AppColors {
  static const Color primaryDarkBlue = Color(0xFF1A237E); // Dark Blue
  static const Color accentGold = Color(0xFFFFD700);    // Gold
  static const Color backgroundWhite = Colors.white;
  static const Color textColorDarkBlue = Color(0xFF1A237E);
  static const Color textColorWhite = Colors.white;

  // Dark mode specific colors
  static const Color darkBackground = Color(0xFF121212); // Very dark gray
  static const Color darkCardBackground = Color(0xFF1E1E1E); // Slightly lighter dark gray
  static const Color darkAppBarBackground = Color(0xFF0D0D0D); // Even darker
  static const Color darkTextColor = Colors.white;
}

class AppRoutes {
  static const String signIn = '/sign-in';
  static const String signUp = '/sign-up';
  static const String main = '/';
  static const String home = '/home';
  static const String createNewStory = '/create-new-story';
  static const String personalLibrary = '/personal-library';
  static const String settings = '/settings';
  static const String profile = '/profile';
}

class AppConstants {
  static const String appName = 'AI Story Gen';
}
