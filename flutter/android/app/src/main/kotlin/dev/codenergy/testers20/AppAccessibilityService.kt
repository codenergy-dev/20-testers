package dev.codenergy.testers20

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.content.Intent
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import com.google.firebase.FirebaseApp
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import java.text.SimpleDateFormat
import java.util.Date
import java.util.TimeZone

class AppAccessibilityService : AccessibilityService() {
  override fun onServiceConnected() {
    setAccessibilityEnabled(true)
    initializeFirebaseIfNeeded()
    Log.d("AppAccessibilityService", "onServiceConnected")
  }
  
  override fun onInterrupt() {
    Log.d("AppAccessibilityService", "onInterrupt")
  }

  override fun onUnbind(intent: Intent?): Boolean {
    setAccessibilityEnabled(false)
    Log.d("AppAccessibilityService", "onUnbind")
    return super.onUnbind(intent)
  }

  override fun onDestroy() {
    super.onDestroy()
    setAccessibilityEnabled(false)
    Log.d("AppAccessibilityService", "onDestroy")
  }

  override fun onAccessibilityEvent(event: AccessibilityEvent?) {
    try {
      initializeFirebaseIfNeeded()
      val prefs = getSharedPreferences("FlutterSharedPreferences", Context.MODE_PRIVATE)
      val uid = prefs.getString("flutter.uid", "")!!
      if (uid.isEmpty()) return
      val packageName = event?.packageName!!.toString()
      if (!prefs.contains("flutter.$packageName")) return
      val lastAppOpen = prefs.getString("flutter.$packageName", "")!!
      val todayAppOpen = SimpleDateFormat("yyyy-MM-dd").format(Date())
      if (lastAppOpen == todayAppOpen) return
      val db = Firebase.firestore
      val isoDateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").apply {
        timeZone = TimeZone.getTimeZone("UTC")
      }
      db.collection("events").add(hashMapOf(
        "uid" to uid,
        "event" to "app_open",
        "packageName" to packageName,
        "created" to isoDateFormat.format(Date()),
      ))
      prefs.edit().putString("flutter.$packageName", todayAppOpen).apply()
      Log.d("onAccessibilityEvent", "app_open $packageName")
    } catch (e: Exception) {
      Log.e("onAccessibilityEvent", e.stackTraceToString())
    }
  }

  fun initializeFirebaseIfNeeded() {
    if (FirebaseApp.getApps(applicationContext).isEmpty()) {
      FirebaseApp.initializeApp(applicationContext)
    }
  }

  fun setAccessibilityEnabled(value: Boolean) {
    val prefs = getSharedPreferences("FlutterSharedPreferences", Context.MODE_PRIVATE)
    prefs.edit().putBoolean("flutter.accessibilityEnabled", value).apply()
  }
}