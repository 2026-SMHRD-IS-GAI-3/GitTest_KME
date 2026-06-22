package com.swinglab.model;

import lombok.Data;

@Data
public class DashboardDTO {

    private String name;
    private String grade;
    private int avgScore;
    private int remainScore;
    private int progress;

}