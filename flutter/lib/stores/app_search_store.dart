import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

class AppSearchStore extends ValueNotifier<List<dynamic>> {
  AppSearchStore() : super([]);

  Future<void> search(String query) async {
    FirebaseFirestore.instance
      .collection('apps')
      .where('keywords', whereIn: query.split(' '))
      .get();
  }
}