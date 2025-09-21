import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:ai_story_gen/models/story.dart';

class StoryService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // Get all stories for a specific user
  Stream<List<Story>> getStoriesForUser(String userId) {
    return _db
        .collection('stories')
        .where('userId', isEqualTo: userId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => Story.fromFirestore(doc))
            .toList());
  }

  // Get favorite stories for a specific user
  Stream<List<Story>> getFavoriteStoriesForUser(String userId) {
    return _db
        .collection('stories')
        .where('userId', isEqualTo: userId)
        .where('isFavorite', isEqualTo: true)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => Story.fromFirestore(doc))
            .toList());
  }

  // Add a new story
  Future<void> addStory(Story story) async {
    await _db.collection('stories').add(story.toFirestore());
  }

  // Update an existing story
  Future<void> updateStory(Story story) async {
    if (story.id == null) {
      throw Exception('Story ID cannot be null for update.');
    }
    await _db.collection('stories').doc(story.id).update(story.toFirestore());
  }

  // Delete a story
  Future<void> deleteStory(String storyId) async {
    await _db.collection('stories').doc(storyId).delete();
  }
}
