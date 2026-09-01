import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../l10n/app_localization.dart';

class LanguageProvider extends ChangeNotifier {
  String _currentLanguage = 'en';

  String get currentLanguage => _currentLanguage;
  AppLocalization get localization => AppLocalization(_currentLanguage);

  LanguageProvider() {
    _loadLanguage();
  }

  Future<void> _loadLanguage() async {
    final prefs = await SharedPreferences.getInstance();
    _currentLanguage = prefs.getString('college_transport_lang') ?? 'en';
    notifyListeners();
  }

  Future<void> setLanguage(String langCode) async {
    _currentLanguage = langCode;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('college_transport_lang', langCode);
    notifyListeners();
  }

  String t(String key) => localization.translate(key);
}
