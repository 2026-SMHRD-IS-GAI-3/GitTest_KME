package com.swinglab.model;

public class UserDTO {

    private int userId;
    private String name;
    private String email;
    private String password;
    private String nickname;
    private String phone;
    private String gender_type;

    public UserDTO() {
    }

    public UserDTO(String name, String email, String password, String nickname, String phone, String gender_type) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.phone = phone;
        this.gender_type = gender_type;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }
    
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getGender_type() {
        return gender_type;
    }

    public void setGender_type(String gender_type) {
        this.gender_type = gender_type;
    }
}