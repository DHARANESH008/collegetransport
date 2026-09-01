import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/api_constants.dart';

class ApiService {
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  static Future<Map<String, String>> _headers() async {
    final token = await getToken();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  static Future<Map<String, dynamic>> post(String url, Map<String, dynamic> body) async {
    final headers = await _headers();
    final response = await http.post(
      Uri.parse(url),
      headers: headers,
      body: jsonEncode(body),
    );
    final decoded = jsonDecode(response.body);
    if (response.statusCode >= 200 && response.statusCode < 300 && decoded['success'] == true) {
      return decoded;
    }
    throw Exception(decoded['message'] ?? 'Network Error');
  }

  static Future<Map<String, dynamic>> get(String url) async {
    final headers = await _headers();
    final response = await http.get(
      Uri.parse(url),
      headers: headers,
    );
    final decoded = jsonDecode(response.body);
    if (response.statusCode >= 200 && response.statusCode < 300 && decoded['success'] == true) {
      return decoded;
    }
    throw Exception(decoded['message'] ?? 'Network Error');
  }

  static Future<Map<String, dynamic>> put(String url, Map<String, dynamic> body) async {
    final headers = await _headers();
    final response = await http.put(
      Uri.parse(url),
      headers: headers,
      body: jsonEncode(body),
    );
    final decoded = jsonDecode(response.body);
    if (response.statusCode >= 200 && response.statusCode < 300 && decoded['success'] == true) {
      return decoded;
    }
    throw Exception(decoded['message'] ?? 'Network Error');
  }
}
