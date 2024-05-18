import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_ui_firestore/firebase_ui_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter_accessibility_service/flutter_accessibility_service.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:testers20/firebase_options.dart';
import 'package:testers20/stores/app_testing_store.dart';
import 'package:testers20/stores/user_store.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const App());
}

class App extends StatefulWidget {
  const App({super.key});

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> with WidgetsBindingObserver {
  final appTesting = AppTestingStore();
  final isAccessibilityPermissionEnabled = ValueNotifier(false);
  final user = UserStore();
  
  @override
  void initState() {
    super.initState();
    checkIsAccessibilityPermissionEnabled();
    user.addListener(onUserChanged);
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      checkIsAccessibilityPermissionEnabled();
    }
  }

  Future<void> checkIsAccessibilityPermissionEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.reload();
    isAccessibilityPermissionEnabled.value = prefs.getBool('accessibilityEnabled') ?? false;
  }

  void onUserChanged() {
    final uid = user.value?.uid ?? '';
    if (user.isSignedIn) appTesting.fetch(uid);
    SharedPreferences.getInstance().then((prefs) => prefs.setString('uid', uid));
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      themeMode: ThemeMode.system,
      theme: ThemeData.light(),
      darkTheme: ThemeData.dark(),
      home: Scaffold(
        appBar: AppBar(
          leading: const Icon(Icons.science),
          actions: [
            ValueListenableBuilder(
              valueListenable: user, 
              builder: (_, __, ___) => GestureDetector(
                onTap: user.isSignedOut ? user.signIn : user.signOut,
                child: CircleAvatar(
                  foregroundImage: user.isSignedIn && user.value!.photoURL?.isNotEmpty == true
                    ? NetworkImage(user.value!.photoURL!)
                    : null,
                  child: const Icon(Icons.person),
                ),
              ),
            ),
            const SizedBox(width: 16),
          ],
        ),
        body: ValueListenableBuilder(
          valueListenable: isAccessibilityPermissionEnabled, 
          builder: (_, isAccessibilityPermissionEnabled, __) =>
            !isAccessibilityPermissionEnabled
            ? Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const Text(
                    'You need to enable accessibility service on settings '
                    'to track your test usage of developers\' apps.',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: () => FlutterAccessibilityService
                      .requestAccessibilityPermission()
                      .then((_) => checkIsAccessibilityPermissionEnabled()), 
                    icon: const Icon(Icons.open_in_new),
                    label: const Text('Open settings'),
                  )
                ],
              ),
            )
            : ValueListenableBuilder(
              valueListenable: user, 
              builder: (_, __, ___) =>
                user.isSignedIn
                ? ValueListenableBuilder(
                  valueListenable: appTesting,
                  builder: (_, __, ___) => FirestoreListView<Map<String, dynamic>>(
                    query: FirebaseFirestore.instance.collection('apps'),
                    itemBuilder: (_, doc) {
                      final app = doc.data();
                      final packageName = app['packageName'];
                      return ListTile(
                        title: Text(app['applicationName']),
                        subtitle: Text(packageName),
                        leading: const Icon(Icons.android),
                        trailing: Checkbox(
                          value: appTesting.any(packageName), 
                          onChanged: (checked) {
                            if (checked == true) {
                              appTesting.add(user.value!.uid, packageName);
                            }
                          },
                        ),
                      );
                    },
                  ),
                )
                : Container(
                  constraints: const BoxConstraints.expand(),
                  padding: const EdgeInsets.all(16.0),
                  child: const Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Icon(Icons.warning),
                      SizedBox(height: 16),
                      Text('You need to sign in.', textAlign: TextAlign.center),
                    ],
                  ),
                )
            ),
        ),
      ),
    );
  }
}