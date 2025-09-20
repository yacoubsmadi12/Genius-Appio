import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:ai_story_gen/core/constants.dart';
import 'package:ai_story_gen/models/story.dart';
import 'package:ai_story_gen/services/story_service.dart';
import 'package:ai_story_gen/widgets/story_card.dart';
import 'package:google_fonts/google_fonts.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    final StoryService storyService = StoryService();

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Welcome to AI Story Gen!',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).brightness == Brightness.dark
                      ? AppColors.textColorWhite
                      : AppColors.textColorDarkBlue,
                ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {
                Navigator.of(context).pushNamed(AppRoutes.createNewStory);
              },
              icon: const Icon(Icons.auto_stories),
              label: const Text('Generate New Story'),
            ),
          ),
          const SizedBox(height: 30),
          Text(
            'Your Recent Stories',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).brightness == Brightness.dark
                      ? AppColors.textColorWhite
                      : AppColors.textColorDarkBlue,
                ),
          ),
          const SizedBox(height: 10),
          Expanded(
            child: user == null
                ? Center(
                    child: Text(
                      'Please sign in to view your stories.',
                      style: GoogleFonts.inter(
                        color: Theme.of(context).brightness == Brightness.dark
                            ? Colors.grey.shade400
                            : Colors.grey.shade700,
                      ),
                    ),
                  )
                : StreamBuilder<List<Story>>(
                    stream: storyService.getStoriesForUser(user.uid),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const Center(child: CircularProgressIndicator());
                      }
                      if (snapshot.hasError) {
                        return Center(child: Text('Error: ${snapshot.error}'));
                      }
                      if (!snapshot.hasData || snapshot.data!.isEmpty) {
                        return Center(
                          child: Text(
                            'No stories yet. Start generating some!',
                            style: GoogleFonts.inter(
                              color: Theme.of(context).brightness == Brightness.dark
                                  ? Colors.grey.shade400
                                  : Colors.grey.shade700,
                            ),
                          ),
                        );
                      }
                      return ListView.builder(
                        itemCount: snapshot.data!.length > 5 ? 5 : snapshot.data!.length, // Show up to 5 recent stories
                        itemBuilder: (context, index) {
                          final story = snapshot.data![index];
                          return StoryCard(story: story);
                        },
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
