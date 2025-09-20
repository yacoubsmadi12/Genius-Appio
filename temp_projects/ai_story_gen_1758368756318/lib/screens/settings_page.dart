import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:ai_story_gen/core/constants.dart';
import 'package:ai_story_gen/providers/theme_provider.dart';
import 'package:ai_story_gen/services/auth_service.dart';
import 'package:google_fonts/google_fonts.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final AuthService authService = AuthService();
    final isDarkMode = themeProvider.themeMode == ThemeMode.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text('Settings', style: GoogleFonts.cormorantGaramond()),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          SwitchListTile(
            title: Text(
              'Dark Reading Mode',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: isDarkMode ? AppColors.darkTextColor : AppColors.textColorDarkBlue,
                  ),
            ),
            subtitle: Text(
              'Switch between light and dark themes for reading and app UI.',
              style: GoogleFonts.inter(
                color: isDarkMode ? Colors.grey.shade400 : Colors.grey.shade700,
              ),
            ),
            value: isDarkMode,
            onChanged: (value) {
              themeProvider.toggleTheme();
            },
            activeColor: AppColors.accentGold,
            inactiveTrackColor: Colors.grey.shade400,
            secondary: Icon(isDarkMode ? Icons.dark_mode : Icons.light_mode, color: AppColors.primaryDarkBlue),
          ),
          const Divider(height: 30),
          ListTile(
            title: Text(
              'About AI Story Gen',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: isDarkMode ? AppColors.darkTextColor : AppColors.textColorDarkBlue,
                  ),
            ),
            subtitle: Text(
              'Version 1.0.0. An AI-powered story generation application.',
              style: GoogleFonts.inter(
                color: isDarkMode ? Colors.grey.shade400 : Colors.grey.shade700,
              ),
            ),
            leading: const Icon(Icons.info_outline, color: AppColors.primaryDarkBlue),
            onTap: () {
              showAboutDialog(
                context: context,
                applicationName: AppConstants.appName,
                applicationVersion: '1.0.0',
                applicationLegalese: '© 2023 AI Story Gen. All rights reserved.',
                children: [
                  Padding(
                    padding: const EdgeInsets.only(top: 15.0),
                    child: Text('This app allows you to generate, save, and share AI-powered stories.', style: GoogleFonts.inter()),
                  ),
                ],
              );
            },
          ),
          const Divider(height: 30),
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.redAccent),
            title: Text(
              'Logout',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(color: Colors.redAccent),
            ),
            onTap: () async {
              await authService.signOut();
              if (context.mounted) {
                Navigator.of(context).pushReplacementNamed(AppRoutes.signIn);
              }
            },
          ),
        ],
      ),
    );
  }
}
