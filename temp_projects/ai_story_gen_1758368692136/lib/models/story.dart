import 'package:cloud_firestore/cloud_firestore.dart';

class Story {
  final String? id;
  final String userId;
  final String title;
  final String content;
  final String genre;
  final bool isFavorite;
  final DateTime createdAt;
  final String? sharedBy;

  Story({
    this.id,
    required this.userId,
    required this.title,
    required this.content,
    required this.genre,
    this.isFavorite = false,
    required this.createdAt,
    this.sharedBy,
  });

  factory Story.fromFirestore(DocumentSnapshot<Map<String, dynamic>> doc) {
    final data = doc.data()!;
    return Story(
      id: doc.id,
      userId: data['userId'] as String,
      title: data['title'] as String,
      content: data['content'] as String,
      genre: data['genre'] as String,
      isFavorite: data['isFavorite'] as bool,
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      sharedBy: data['sharedBy'] as String?,
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'userId': userId,
      'title': title,
      'content': content,
      'genre': genre,
      'isFavorite': isFavorite,
      'createdAt': Timestamp.fromDate(createdAt),
      'sharedBy': sharedBy,
    };
  }

  Story copyWith({
    String? id,
    String? userId,
    String? title,
    String? content,
    String? genre,
    bool? isFavorite,
    DateTime? createdAt,
    String? sharedBy,
  }) {
    return Story(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      content: content ?? this.content,
      genre: genre ?? this.genre,
      isFavorite: isFavorite ?? this.isFavorite,
      createdAt: createdAt ?? this.createdAt,
      sharedBy: sharedBy ?? this.sharedBy,
    );
  }
}
