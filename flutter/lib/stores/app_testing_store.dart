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
      .map((doc) => doc.data())
      .toList();
    SharedPreferences.getInstance().then((prefs) {
      for (dynamic appTesting in value) {
        final packageName = appTesting['packageName'];
        if (!prefs.containsKey(packageName)) {
          prefs.setString(packageName, '');
        }
      }
    });
  }

  void add(String uid, String packageName) {
    final data = {
      'uid': uid,
      'packageName': packageName,
      'created': DateTime.now().toIso8601String(),
    };
    FirebaseFirestore.instance
      .collection('app-testing')
      .add(data);
    value = [...value, data];
    SharedPreferences.getInstance().then((prefs) => prefs.setString(packageName, ''));
  }

  bool any(String packageName) =>
    value.any((appTesting) => appTesting['packageName'] == packageName);
}