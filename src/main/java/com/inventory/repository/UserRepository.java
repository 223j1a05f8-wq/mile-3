package com.inventory.repository;

import com.inventory.entity.User;
import com.inventory.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    List<User> findByRoleAndIsDeleted(Role role, boolean isDeleted);
    
    List<User> findByRole(Role role);
    
    List<User> findByIsDeleted(boolean isDeleted);
    
    List<User> findByIsDeletedAndDeletedAtBefore(boolean isDeleted, LocalDateTime deletedAt);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.isDeleted = false")
    long countActiveByRole(@Param("role") Role role);
    
    @Query("SELECT u FROM User u WHERE u.isDeleted = false AND u.role IN :roles")
    List<User> findActiveUsersByRoles(@Param("roles") List<Role> roles);
    
    boolean existsByEmailAndIsDeleted(String email, boolean isDeleted);
}