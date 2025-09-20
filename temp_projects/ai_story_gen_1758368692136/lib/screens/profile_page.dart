import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:ai_story_gen/core/constants.dart';
import 'package:google_fonts/google_fonts.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    final User? user = FirebaseAuth.instance.currentUser;
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text('Profile', style: GoogleFonts.cormorantGaramond()),
        centerTitle: true,
      ),
      body: user == null
          ? Center(
              child: Text(
                'Please sign in to view your profile.',
                style: GoogleFonts.inter(
                  color: isDarkMode ? Colors.grey.shade400 : Colors.grey.shade700,
                ),
              ),
            )
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const CircleAvatar(
                    radius: 60,
                    backgroundColor: AppColors.accentGold,
                    child: Icon(Icons.person, size: 80, color: AppColors.primaryDarkBlue),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    user.email ?? 'No Email Available',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: isDarkMode ? AppColors.textColorWhite : AppColors.textColorDarkBlue,
                        ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Member Since: ${user.metadata.creationTime?.toLocal().toString().split(' ')[0] ?? 'N/A'}',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      color: isDarkMode ? Colors.grey.shade400 : Colors.grey.shade700,
                    ),
                  ),
                  const SizedBox(height: 30),
                  Divider(color: isDarkMode ? Colors.grey.shade700 : Colors.grey.shade300),
                  const SizedBox(height: 20),
                  ListTile(
                    leading: const Icon(Icons.edit, color: AppColors.primaryDarkBlue),
                    title: Text(
                      'Edit Profile',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            color: isDarkMode ? AppColors.darkTextColor : AppColors.textColorDarkBlue,
                          ),
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: AppColors.primaryDarkBlue),
                    onTap: () {
                      // TODO: Implement edit profile functionality
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Edit Profile coming soon!')), 
                      );
                    },
                  ),
                  ListTile(
                    leading: const Icon(Icons.lock_reset, color: AppColors.primaryDarkBlue),
                    title: Text(
                      'Change Password',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            color: isDarkMode ? AppColors.darkTextColor : AppColors.textColorDarkBlue,
                          ),
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: AppColors.primaryDarkBlue),
                    onTap: () {
                      // TODO: Implement change password functionality
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Change Password coming soon!')), 
                      );
                    },
                  ),
                ],
              ),
            ),
    );
  }
}
