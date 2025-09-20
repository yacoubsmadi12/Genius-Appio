import 'package:flutter/material.dart';
import 'package:ai_story_gen/core/constants.dart';
import 'package:ai_story_gen/models/story.dart';
import 'package:ai_story_gen/services/story_service.dart';
import 'package:google_fonts/google_fonts.dart';

class StoryCard extends StatefulWidget {
  final Story story;

  const StoryCard({super.key, required this.story});

  @override
  State<StoryCard> createState() => _StoryCardState();
}

class _StoryCardState extends State<StoryCard> {
  final StoryService _storyService = StoryService();

  Future<void> _toggleFavorite() async {
    try {
      final updatedStory = widget.story.copyWith(isFavorite: !widget.story.isFavorite);
      await _storyService.updateStory(updatedStory);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(updatedStory.isFavorite ? 'Added to favorites!' : 'Removed from favorites.')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to update favorite status: $e')),
        );
      }
    }
  }

  void _showStoryDetails() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        final isDarkMode = Theme.of(context).brightness == Brightness.dark;
        return AlertDialog(
          backgroundColor: isDarkMode ? AppColors.darkCardBackground : AppColors.backgroundWhite,
          title: Text(
            widget.story.title,
            style: GoogleFonts.cormorantGaramond(
              fontWeight: FontWeight.bold,
              color: isDarkMode ? AppColors.darkTextColor : AppColors.textColorDarkBlue,
            ),
          ),
          content: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Genre: ${widget.story.genre}',
                  style: GoogleFonts.inter(
                    fontWeight: FontWeight.w600,
                    color: isDarkMode ? Colors.grey.shade400 : Colors.grey.shade700,
                  ),
                ),
                const SizedBox(height: 10),
                SelectableText(
                  widget.story.content,
                  style: GoogleFonts.merriweather(
                    fontSize: 16,
                    height: 1.5,
                    color: isDarkMode ? AppColors.darkTextColor : AppColors.textColorDarkBlue,
                  ),
                ),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Close', style: GoogleFonts.inter(color: AppColors.accentGold)),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 8.0),
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: _showStoryDetails,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                widget.story.title,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: isDarkMode ? AppColors.darkTextColor : AppColors.textColorDarkBlue,
                    ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 8),
              Text(
                'Genre: ${widget.story.genre}',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      fontStyle: FontStyle.italic,
                      color: isDarkMode ? Colors.grey.shade400 : Colors.grey.shade700,
                    ),
              ),
              const SizedBox(height: 8),
              Text(
                widget.story.content,
                style: Theme.of(context).textTheme.bodyText2?.copyWith(
                      color: isDarkMode ? AppColors.darkTextColor.withOpacity(0.8) : AppColors.textColorDarkBlue.withOpacity(0.8),
                    ),
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Created: ${widget.story.createdAt.toLocal().toString().split(' ')[0]}',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: isDarkMode ? Colors.grey.shade500 : Colors.grey.shade600,
                    ),
                  ),
                  IconButton(
                    icon: Icon(
                      widget.story.isFavorite ? Icons.bookmark : Icons.bookmark_border,
                      color: widget.story.isFavorite ? AppColors.accentGold : (isDarkMode ? Colors.grey.shade400 : Colors.grey.shade600),
                    ),
                    onPressed: _toggleFavorite,
                    tooltip: widget.story.isFavorite ? 'Remove from favorites' : 'Add to favorites',
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
