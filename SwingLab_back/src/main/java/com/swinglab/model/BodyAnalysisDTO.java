package com.swinglab.model;

public class BodyAnalysisDTO {

    private int userId;

    private double height;
    private double weight;

    private double shoulderWidth;
    private double pelvisWidth;

    private double armLengthRatio;
    private String armLengthType;

    private String handType;
    private String bodyCode;

    public BodyAnalysisDTO() {
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public double getShoulderWidth() {
        return shoulderWidth;
    }

    public void setShoulderWidth(double shoulderWidth) {
        this.shoulderWidth = shoulderWidth;
    }

    public double getPelvisWidth() {
        return pelvisWidth;
    }

    public void setPelvisWidth(double pelvisWidth) {
        this.pelvisWidth = pelvisWidth;
    }

    public double getArmLengthRatio() {
        return armLengthRatio;
    }

    public void setArmLengthRatio(double armLengthRatio) {
        this.armLengthRatio = armLengthRatio;
    }

    public String getArmLengthType() {
        return armLengthType;
    }

    public void setArmLengthType(String armLengthType) {
        this.armLengthType = armLengthType;
    }

    public String getHandType() {
        return handType;
    }

    public void setHandType(String handType) {
        this.handType = handType;
    }

    public String getBodyCode() {
        return bodyCode;
    }

    public void setBodyCode(String bodyCode) {
        this.bodyCode = bodyCode;
    }
    private double shoulderHipRatio;

    public double getShoulderHipRatio() {
        return shoulderHipRatio;
    }

    public void setShoulderHipRatio(double shoulderHipRatio) {
        this.shoulderHipRatio = shoulderHipRatio;
    }
}