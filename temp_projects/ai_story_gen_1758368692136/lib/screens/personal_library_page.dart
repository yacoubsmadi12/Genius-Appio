import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:ai_story_gen/core/constants.dart';
import 'package:ai_story_gen/models/story.dart';
import 'package:ai_story_gen/services/story_service.dart';
import 'package:ai_story_gen/widgets/story_card.dart';
import 'package:google_fonts/google_fonts.dart';

class PersonalLibraryPage extends StatefulWidget {
  const PersonalLibraryPage({super.key});

  @override
  State<PersonalLibraryPage> createState() => _PersonalLibraryPageState();
}

class _PersonalLibraryPageState extends State<PersonalLibraryPage> {
  final StoryService _storyService = StoryService();
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _searchController.addListener(() {
      setState(() {
        _searchQuery = _searchController.text;
      });
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    if (user == null) {
      return Center(
        child: Text(
          'Please sign in to view your personal library.',
          style: GoogleFonts.inter(
            color: isDarkMode ? Colors.grey.shade400 : Colors.grey.shade700,
          ),
        ),
      );
    }

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: TextField(
            controller: _searchController,
            decoration: InputDecoration(
              labelText: 'Search stories by title or genre',
              hintText: 'Search...', 
              prefixIcon: const Icon(Icons.search, color: AppColors.primaryDarkBlue),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
              filled: true,
              fillColor: isDarkMode ? Colors.grey.shade800 : Colors.grey.shade200,
            ),
            style: GoogleFonts.inter(
              color: isDarkMode ? AppColors.darkTextColor : AppColors.textColorDarkBlue,
            ),
          ),
        ),
        Expanded(
          child: StreamBuilder<List<Story>>(
            stream: _storyService.getStoriesForUser(user.uid),
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
                    'Your library is empty. Start generating some stories!',
                    style: GoogleFonts.inter(
                      color: isDarkMode ? Colors.grey.shade400 : Colors.grey.shade700,
                    ),
                  ),
                );
              }

              final filteredStories = snapshot.data!.where((story) {
                final query = _searchQuery.toLowerCase();
                return story.title.toLowerCase().contains(query) ||
                    story.genre.toLowerCase().contains(query) ||
                    story.content.toLowerCase().contains(query);
              }).toList();

              if (filteredStories.isEmpty) {
                return Center(
                  child: Text(
                    'No stories found matching "$_searchQuery".',
                    style: GoogleFonts.inter(
                      color: isDarkMode ? Colors.grey.shade400 : Colors.grey.shade700,
                    ),
                  ),
                );
              }

              return ListView.builder(
                itemCount: filteredStories.length,
                itemBuilder: (context, index) {
                  final story = filteredStories[index];
                  return StoryCard(story: story);
                },
              );
            },
          ),
        ),
      ],
    );
  }
}
