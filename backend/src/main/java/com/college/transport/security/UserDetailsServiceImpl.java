package com.college.transport.security;

import com.college.transport.entity.User;
import com.college.transport.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String trimmed = username.trim();
        User user = userRepository.findByUsernameIgnoreCase(trimmed)
                .orElseGet(() -> userRepository.findByEmail(trimmed.toLowerCase())
                        .orElseGet(() -> {
                            // If input is purely a number e.g. "25", try searching "DR25"
                            if (trimmed.matches("\\d+")) {
                                return userRepository.findByUsernameIgnoreCase("DR" + trimmed).orElse(null);
                            }
                            return null;
                        }));

        if (user == null) {
            throw new UsernameNotFoundException("User not found with username or email: " + username);
        }

        return UserDetailsImpl.build(user);
    }
}
