import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:share_plus/share_plus.dart'; // For sharing stories
import 'package:ai_story_gen/core/constants.dart';
import 'package:ai_story_gen/models/story.dart';
import 'package:ai_story_gen/services/story_service.dart';
import 'package:google_fonts/google_fonts.dart';

class CreateNewStoryPage extends StatefulWidget {
  const CreateNewStoryPage({super.key});

  @override
  State<CreateNewStoryPage> createState() => _CreateNewStoryPageState();
}

class _CreateNewStoryPageState extends State<CreateNewStoryPage> {
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _keywordsController = TextEditingController();
  String _selectedGenre = 'Fantasy';
  double _storyLength = 500; // Placeholder for character count or similar
  String _generatedStoryContent = '';
  bool _isGenerating = false;
  final StoryService _storyService = StoryService();

  final List<String> _genres = [
    'Fantasy', 'Sci-Fi', 'Mystery', 'Romance', 'Horror', 'Adventure', 'Historical'
  ];

  Future<void> _generateStory() async {
    if (_titleController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a story title.')),
      );
      return;
    }

    setState(() {
      _isGenerating = true;
      _generatedStoryContent = ''; // Clear previous story
    });

    // Simulate AI generation process
    await Future.delayed(const Duration(seconds: 3));

    final String storyPrompt = 'Genre: $_selectedGenre, Keywords: ${_keywordsController.text}, Length: ${_storyLength.toInt()} words.';
    setState(() {
      _generatedStoryContent = 'Once upon a time, in a land of $_selectedGenre and ${_keywordsController.text.isEmpty ? 'wonder' : _keywordsController.text}, a hero embarked on a quest. This AI-generated tale, spanning approximately ${_storyLength.toInt()} words, will captivate your imagination with its intricate plot and memorable characters. It explores themes of bravery, friendship, and destiny in a world where magic and mystery intertwine.';
      _isGenerating = false;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Story generated successfully!')), 
    );
  }

  Future<void> _saveStory() async {
    if (_generatedStoryContent.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please generate a story first.')),
      );
      return;
    }

    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please sign in to save stories.')),
      );
      return;
    }

    final newStory = Story(
      userId: user.uid,
      title: _titleController.text.trim().isNotEmpty ? _titleController.text.trim() : 'Untitled Story',
      content: _generatedStoryContent,
      genre: _selectedGenre,
      createdAt: DateTime.now(),
    );

    try {
      await _storyService.addStory(newStory);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Story saved to your library!')), 
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to save story: $e')),
        );
      }
    }
  }

  void _shareStory() {
    if (_generatedStoryContent.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please generate a story first to share.')),
      );
      return;
    }

    Share.share(
        'Check out this AI-generated story: "${_titleController.text.trim().isNotEmpty ? _titleController.text.trim() : 'Untitled Story'}"\n\n${_generatedStoryContent}\n\nGenerated with AI Story Gen app!',
        subject: 'An AI-Generated Story from AI Story Gen'
    );
  }

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Craft Your Tale',
            style: textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: isDarkMode ? AppColors.textColorWhite : AppColors.textColorDarkBlue,
                ),
          ),
          const SizedBox(height: 20),
          TextField(
            controller: _titleController,
            decoration: const InputDecoration(
              labelText: 'Story Title',
              hintText: 'e.g., The Last Dragon Rider',
            ),
          ),
          const SizedBox(height: 16),
          DropdownButtonFormField<String>(
            value: _selectedGenre,
            decoration: const InputDecoration(
              labelText: 'Genre',
            ),
            items: _genres.map((String genre) {
              return DropdownMenuItem<String>(
                value: genre,
                child: Text(genre),
              );
            }).toList(),
            onChanged: (String? newValue) {
              if (newValue != null) {
                setState(() {
                  _selectedGenre = newValue;
                });
              }
            },
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _keywordsController,
            decoration: const InputDecoration(
              labelText: 'Keywords (optional)',
              hintText: 'e.g., ancient magic, lost artifact, brave knight',
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Story Length: ${_storyLength.toInt()} words',
            style: textTheme.titleMedium?.copyWith(
                  color: isDarkMode ? AppColors.textColorWhite : AppColors.textColorDarkBlue,
                ),
          ),
          Slider(
            value: _storyLength,
            min: 100,
            max: 1000,
            divisions: 90,
            label: _storyLength.round().toString(),
            onChanged: (double value) {
              setState(() {
                _storyLength = value;
              });
            },
            activeColor: AppColors.accentGold,
            inactiveColor: isDarkMode ? Colors.grey.shade700 : Colors.grey.shade300,
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _isGenerating ? null : _generateStory,
              icon: _isGenerating ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: AppColors.primaryDarkBlue)) : const Icon(Icons.psychology_alt),
              label: Text(_isGenerating ? 'Generating...' : 'Generate Story'),
            ),
          ),
          if (_generatedStoryContent.isNotEmpty) ...[
            const SizedBox(height: 30),
            Text(
              'Generated Story:',
              style: textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: isDarkMode ? AppColors.textColorWhite : AppColors.textColorDarkBlue,
                  ),
            ),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isDarkMode ? AppColors.darkCardBackground : Colors.grey.shade100,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: isDarkMode ? Colors.grey.shade700 : Colors.grey.shade300),
              ),
              child: SelectableText(
                _generatedStoryContent,
                style: GoogleFonts.merriweather(
                  fontSize: 16,
                  height: 1.5,
                  color: isDarkMode ? AppColors.darkTextColor : AppColors.textColorDarkBlue,
                ),
              ),
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _saveStory,
                    icon: const Icon(Icons.bookmark_add),
                    label: const Text('Save Story'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryDarkBlue, // Dark Blue button
                      foregroundColor: AppColors.accentGold,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _shareStory,
                    icon: const Icon(Icons.share),
                    label: const Text('Share'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey.shade700, // A neutral color for share
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
