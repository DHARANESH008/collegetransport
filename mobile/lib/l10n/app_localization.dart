class AppLocalization {
  final String languageCode;

  AppLocalization(this.languageCode);

  static final Map<String, Map<String, String>> _localizedValues = {
    'en': {
      'app_title': 'Smart College Transport',
      'college_name': 'Shree Venkateshwara Group of Institutions',
      'login_title': 'Sign In to Transport Portal',
      'login_subtitle': 'Role-Based Mobile System',
      'username': 'Username or Email',
      'password': 'Password',
      'sign_in': 'Sign In',
      'admin_register': 'Admin Reference Registration',
      'dashboard': 'Dashboard',
      'driver_console': 'Driver Console',
      'security_gate': 'Security Gate Terminal',
      'assigned_bus': 'Assigned Bus',
      'route': 'Route',
      'start_journey': 'START JOURNEY',
      'save_students': 'SAVE STUDENTS',
      'end_journey': 'END JOURNEY',
      'bus_enter': 'BUS ENTER',
      'today_entries': 'Today Entries',
      'bus_search': 'Bus 0-150 Search',
      'reports': 'Reports',
      'logout': 'Logout',
      'start_km': 'Start KM',
      'end_km': 'End KM',
      'distance': 'Distance',
      'students': 'Students',
      'gate_name': 'Gate Name',
      'select_bus': 'Select Bus Number (0-150)',
      'duplicate_error': 'Bus already entered today at gate!',
    },
    'ta': {
      'app_title': 'ஸ்மார்ட் கல்லூரி போக்குவரத்து',
      'college_name': 'ஸ்ரீ வெங்கடேஸ்வரா கல்வி நிறுவனங்கள்',
      'login_title': 'போக்குவரத்து உள்நுழைவு',
      'login_subtitle': 'பங்கு அடிப்படையிலான மொபைல் அமைப்பு',
      'username': 'பயனர்பெயர் அல்லது மின்னஞ்சல்',
      'password': 'கடவுச்சொல்',
      'sign_in': 'உள்நுழைக',
      'admin_register': 'நிர்வாகி பதிவு',
      'dashboard': 'முகப்பு பலகை',
      'driver_console': 'ஓட்டுநர் பலகை',
      'security_gate': 'பாதுகாப்பு வாயில்',
      'assigned_bus': 'ஒதுக்கப்பட்ட பேருந்து',
      'route': 'வழித்தடம்',
      'start_journey': 'பயணத்தை தொடங்கு',
      'save_students': 'மாணவர்களை சேமி',
      'end_journey': 'பயணத்தை முடி',
      'bus_enter': 'பேருந்து நுழைவு',
      'today_entries': 'இன்றைய நுழைவுகள்',
      'bus_search': 'பேருந்து தேடல்',
      'reports': 'அறிக்கைகள்',
      'logout': 'வெளியேறு',
      'start_km': 'தொடக்க கி.மீ',
      'end_km': 'முடிவு கி.மீ',
      'distance': 'தூரம்',
      'students': 'மாணவர்கள்',
      'gate_name': 'வாயில் பெயர்',
      'select_bus': 'பேருந்து எண் (0-150)',
      'duplicate_error': 'இப்பேருந்து ஏற்கனவே இன்று நுழைந்துள்ளது!',
    }
  };

  String translate(String key) {
    return _localizedValues[languageCode]?[key] ?? _localizedValues['en']?[key] ?? key;
  }
}
