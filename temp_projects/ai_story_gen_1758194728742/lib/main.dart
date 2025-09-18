import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'package:ai_story_gen/app.dart';
import 'package:ai_story_gen/services/firebase_auth_service.dart';
import 'package:ai_story_gen/services/theme_service.dart';
import 'package:ai_story_gen/services/firestore_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(const MyAppProviderWrapper());
}

class MyAppProviderWrapper extends StatelessWidget {
  const MyAppProviderWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => FirebaseAuthService()),
        ChangeNotifierProvider(create: (_) => ThemeService()),
        Provider(create: (_) => FirestoreService()),
        // You might want to make AIService a provider if it needs to manage state
      ],
      child: const MyApp(),
    );
  }
}
