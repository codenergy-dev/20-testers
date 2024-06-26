import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppTestingStore extends ValueNotifier<List<dynamic>> {
  AppTestingStore() : super([]);

  Future<void> fetch(String uid) async {
    value = (await FirebaseFirestore.instance
      .collection('app-testing')
      .where('uid', isEqualTo: uid)
      .get())
      .docs
      .map((doc) => {...doc.data(), 'id': doc.id})
      .toList();
    SharedPreferences.getInstance().then((prefs) {
      for (dynamic appTesting in value) {
        final packageName = appTesting['packageName'];
        if (!prefs.containsKey(packageName)) {
          prefs.setString(packageName, '');
          prefs.setString('$packageName.app.id', appTesting['appId']);
          prefs.setString('$packageName.testing.id', appTesting['id']);
        }
        prefs.setString('$packageName.testing.status', appTesting['status']);
      }
    });
  }

  Future<void> add(String uid, String appId, String packageName) async {
    final data = {
      'uid': uid,
      'appId': appId,
      'packageName': packageName,
      'status': 'optin',
      'created': DateTime.now().toIso8601String(),
    };
    final doc = await FirebaseFirestore.instance
      .collection('app-testing')
      .add(data);
    value = [...value, data];
    SharedPreferences.getInstance().then((prefs) {
      prefs.setString(packageName, '');
      prefs.setString('$packageName.app.id', appId);
      prefs.setString('$packageName.testing.id', doc.id);
      prefs.setString('$packageName.testing.status', 'optin');
    });
  }

  bool any(String packageName) =>
    value.any((appTesting) => appTesting['packageName'] == packageName);
}