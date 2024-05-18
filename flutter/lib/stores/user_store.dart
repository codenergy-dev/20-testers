import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';

class UserStore extends ValueNotifier<User?> {
  UserStore() : super(null) {
    FirebaseAuth.instance.authStateChanges().listen(onAuthStateChanges);
  }

  bool get isSignedIn => value != null;
  bool get isSignedOut => value == null;

  void onAuthStateChanges(User? user) {
    value = user;
  }

  Future<void> signIn() async {
    if (value != null) return;
    final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();
    final GoogleSignInAuthentication? googleAuth = await googleUser?.authentication;
    final credential = GoogleAuthProvider.credential(
      accessToken: googleAuth?.accessToken,
      idToken: googleAuth?.idToken,
    );
    FirebaseAuth.instance.signInWithCredential(credential);
  }

  Future<void> signOut() async {
    final googleSignIn = GoogleSignIn();
    if (await googleSignIn.isSignedIn()) googleSignIn.signOut();
    FirebaseAuth.instance.signOut();
  }
}