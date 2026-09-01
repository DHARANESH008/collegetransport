import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';
import '../constants/api_constants.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _user;
  bool _loading = false;
  String? _errorMessage;

  UserModel? get user => _user;
  bool get loading => _loading;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _user != null;

  AuthProvider() {
    _loadUser();
  }

  Future<void> _loadUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString('user_data');
    if (userStr != null) {
      try {
        _user = UserModel.fromJson(jsonDecode(userStr));
        notifyListeners();
      } catch (_) {}
    }
  }

  Future<bool> login(String username, String password) async {
    _loading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final res = await ApiService.post(ApiConstants.login, {
        'username': username,
        'password': password,
      });

      if (res['success'] == true && res['data'] != null) {
        _user = UserModel.fromJson(res['data']);
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', _user!.token);
        await prefs.setString('user_data', jsonEncode(res['data']));
        _loading = false;
        notifyListeners();
        return true;
      }
      _errorMessage = res['message'] ?? 'Login failed';
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
    } finally {
      _loading = false;
      notifyListeners();
    }
    return false;
  }

  Future<void> logout() async {
    _user = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('user_data');
    notifyListeners();
  }
}
