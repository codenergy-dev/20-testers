package dev.codenergy.testers20

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.content.Intent
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import com.google.firebase.FirebaseApp
import com.google.firebase.firestore.FieldValue
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
      Log.d("AppAccessibilityService", "app_open ${event?.packageName}")
      
      initializeFirebaseIfNeeded()

      val prefs = getSharedPreferences("FlutterSharedPreferences", Context.MODE_PRIVATE)
      val uid = prefs.getString("flutter.uid", "")!!
      Log.d("AppAccessibilityService", "uid $uid")
      if (uid.isEmpty()) return

      val packageName = event?.packageName!!.toString()
      val appId = prefs.getString("flutter.$packageName.app.id", "")!!
      val testingId = prefs.getString("flutter.$packageName.testing.id", "")!!
      val testingStatus = prefs.getString("flutter.$packageName.testing.status", "")!!
      Log.d("AppAccessibilityService", "appId $appId")
      Log.d("AppAccessibilityService", "testingId $testingId")
      Log.d("AppAccessibilityService", "testingStatus $testingStatus")
      if (appId.isBlank() || testingId.isBlank() || testingStatus.isBlank()) return

      val lastAppOpen = prefs.getString("flutter.$packageName", "")!!
      val todayAppOpen = SimpleDateFormat("yyyy-MM-dd").format(Date())
      Log.d("AppAccessibilityService", "lastAppOpen $lastAppOpen")
      Log.d("AppAccessibilityService", "todayAppOpen $todayAppOpen")
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

      if (testingStatus == "optin") {
        db.collection("apps").document(appId).update(mapOf(
          "testers" to FieldValue.increment(1)
        ))
        db.collection("app-testing").document(testingId).update(mapOf(
          "status" to "testing",
          "optin" to isoDateFormat.format(Date()),
        ))
        prefs.edit().putString("flutter.$packageName.testing.status", "testing").apply()
      }

    } catch (e: Exception) {
      Log.e("AppAccessibilityService", e.stackTraceToString())
    }
  }

  fun initializeFirebaseIfNeeded() {
    try {
      if (FirebaseApp.getApps(applicationContext).isEmpty()) {
        FirebaseApp.initializeApp(applicationContext)
      }
    } catch (e: Exception) {
      Log.e("AppAccessibilityService", e.stackTraceToString())
    }
  }

  fun setAccessibilityEnabled(value: Boolean) {
    val prefs = getSharedPreferences("FlutterSharedPreferences", Context.MODE_PRIVATE)
    prefs.edit().putBoolean("flutter.accessibilityEnabled", value).apply()
    Log.d("AppAccessibilityService", "setAccessibilityEnabled $value")
  }
}