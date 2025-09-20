import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:ai_story_gen/core/constants.dart';
import 'package:ai_story_gen/providers/theme_provider.dart';
import 'package:ai_story_gen/screens/auth/sign_in_page.dart';
import 'package:ai_story_gen/screens/auth/sign_up_page.dart';
import 'package:ai_story_gen/screens/main_screen.dart';
import 'package:ai_story_gen/screens/settings_page.dart';
import 'package:ai_story_gen/screens/profile_page.dart';
import 'package:ai_story_gen/screens/create_new_story_page.dart';
import 'package:ai_story_gen/screens/personal_library_page.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);

    return MaterialApp(
      title: 'AI Story Gen',
      debugShowCheckedModeBanner: false,
      themeMode: themeProvider.themeMode,
      theme: ThemeData(
        brightness: Brightness.light,
        primaryColor: AppColors.primaryDarkBlue,
        scaffoldBackgroundColor: AppColors.backgroundWhite,
        appBarTheme: AppBarTheme(
          backgroundColor: AppColors.primaryDarkBlue,
          foregroundColor: AppColors.accentGold,
          titleTextStyle: GoogleFonts.cormorantGaramond(
            color: AppColors.accentGold,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
          iconTheme: const IconThemeData(color: AppColors.accentGold),
        ),
        floatingActionButtonTheme: const FloatingActionButtonThemeData(
          backgroundColor: AppColors.accentGold,
          foregroundColor: AppColors.primaryDarkBlue,
        ),
        buttonTheme: const ButtonThemeData(
          buttonColor: AppColors.accentGold,
          textTheme: ButtonTextTheme.primary,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.accentGold,
            foregroundColor: AppColors.primaryDarkBlue,
            textStyle: GoogleFonts.inter(fontWeight: FontWeight.bold),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          ),
        ),
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: AppColors.primaryDarkBlue,
            textStyle: GoogleFonts.inter(fontWeight: FontWeight.w600),
          ),
        ),
        cardTheme: CardTheme(
          color: AppColors.backgroundWhite,
          elevation: 4,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.grey.shade200,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide.none),
          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.primaryDarkBlue)),
          hintStyle: GoogleFonts.inter(color: Colors.grey.shade600),
        ),
        textTheme: GoogleFonts.interTextTheme(
          Theme.of(context).textTheme.copyWith(
                displayLarge: const TextStyle(color: AppColors.textColorDarkBlue),
                displayMedium: const TextStyle(color: AppColors.textColorDarkBlue),
                displaySmall: const TextStyle(color: AppColors.textColorDarkBlue),
                headlineLarge: const TextStyle(color: AppColors.textColorDarkBlue),
                headlineMedium: const TextStyle(color: AppColors.textColorDarkBlue),
                headlineSmall: const TextStyle(color: AppColors.textColorDarkBlue),
                titleLarge: const TextStyle(color: AppColors.textColorDarkBlue),
                titleMedium: const TextStyle(color: AppColors.textColorDarkBlue),
                titleSmall: const TextStyle(color: AppColors.textColorDarkBlue),
                bodyLarge: const TextStyle(color: AppColors.textColorDarkBlue),
                bodyMedium: const TextStyle(color: AppColors.textColorDarkBlue),
                bodySmall: const TextStyle(color: AppColors.textColorDarkBlue),
                labelLarge: const TextStyle(color: AppColors.textColorDarkBlue),
                labelMedium: const TextStyle(color: AppColors.textColorDarkBlue),
                labelSmall: const TextStyle(color: AppColors.textColorDarkBlue),
              ),
        ),
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: AppColors.primaryDarkBlue,
          selectedItemColor: AppColors.accentGold,
          unselectedItemColor: Colors.white70,
          type: BottomNavigationBarType.fixed,
          selectedLabelStyle: TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: AppColors.darkBackground,
        scaffoldBackgroundColor: AppColors.darkBackground,
        appBarTheme: AppBarTheme(
          backgroundColor: AppColors.darkAppBarBackground,
          foregroundColor: AppColors.accentGold,
          titleTextStyle: GoogleFonts.cormorantGaramond(
            color: AppColors.accentGold,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
          iconTheme: const IconThemeData(color: AppColors.accentGold),
        ),
        floatingActionButtonTheme: const FloatingActionButtonThemeData(
          backgroundColor: AppColors.accentGold,
          foregroundColor: AppColors.darkBackground,
        ),
        buttonTheme: const ButtonThemeData(
          buttonColor: AppColors.accentGold,
          textTheme: ButtonTextTheme.primary,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.accentGold,
            foregroundColor: AppColors.darkBackground,
            textStyle: GoogleFonts.inter(fontWeight: FontWeight.bold),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          ),
        ),
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: AppColors.accentGold,
            textStyle: GoogleFonts.inter(fontWeight: FontWeight.w600),
          ),
        ),
        cardTheme: CardTheme(
          color: AppColors.darkCardBackground,
          elevation: 4,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.grey.shade800,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide.none),
          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.accentGold)),
          hintStyle: GoogleFonts.inter(color: Colors.grey.shade400),
        ),
        textTheme: GoogleFonts.interTextTheme(
          Theme.of(context).textTheme.copyWith(
                displayLarge: const TextStyle(color: AppColors.textColorWhite),
                displayMedium: const TextStyle(color: AppColors.textColorWhite),
                displaySmall: const TextStyle(color: AppColors.textColorWhite),
                headlineLarge: const TextStyle(color: AppColors.textColorWhite),
                headlineMedium: const TextStyle(color: AppColors.textColorWhite),
                headlineSmall: const TextStyle(color: AppColors.textColorWhite),
                titleLarge: const TextStyle(color: AppColors.textColorWhite),
                titleMedium: const TextStyle(color: AppColors.textColorWhite),
                titleSmall: const TextStyle(color: AppColors.textColorWhite),
                bodyLarge: const TextStyle(color: AppColors.textColorWhite),
                bodyMedium: const TextStyle(color: AppColors.textColorWhite),
                bodySmall: const TextStyle(color: AppColors.textColorWhite),
                labelLarge: const TextStyle(color: AppColors.textColorWhite),
                labelMedium: const TextStyle(color: AppColors.textColorWhite),
                labelSmall: const TextStyle(color: AppColors.textColorWhite),
              ),
        ),
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: AppColors.darkAppBarBackground,
          selectedItemColor: AppColors.accentGold,
          unselectedItemColor: Colors.white70,
          type: BottomNavigationBarType.fixed,
          selectedLabelStyle: TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
      routes: {
        AppRoutes.signIn: (context) => const SignInPage(),
        AppRoutes.signUp: (context) => const SignUpPage(),
        AppRoutes.main: (context) => const MainScreen(),
        AppRoutes.createNewStory: (context) => const CreateNewStoryPage(),
        AppRoutes.personalLibrary: (context) => const PersonalLibraryPage(),
        AppRoutes.settings: (context) => const SettingsPage(),
        AppRoutes.profile: (context) => const ProfilePage(),
      },
      home: StreamBuilder<User?>(
        stream: FirebaseAuth.instance.authStateChanges(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Scaffold(body: Center(child: CircularProgressIndicator()));
          } else if (snapshot.hasData) {
            return const MainScreen(); // User is logged in
          } else {
            return const SignInPage(); // User is not logged in
          }
        },
      ),
    );
  }
}
