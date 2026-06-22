package com.swinglab.model;

import java.util.List;
import java.util.Map;

public class SwingAnalysisSaveDTO {

    private int videoId;
    private int analysisId;
    private int userId;

    private int frontVideoId;
    private int sideVideoId;

    private String clubType;

    private String bodyCode;
    private String armLengthType;
    private String handType;

    private double totalScore;
    private double addressScore;
    private double backswingScore;
    private double downswingScore;
    private double impactScore;

    private double xFactor;

    private String orbit;
    private String flexibility;

    private String frontVideoUrl;
    private String sideVideoUrl;

    private String analysisStatus;
    private String createdAt;

    private List<String> feedbacks;

    private Map<String, Object> sectionDetails;

    public SwingAnalysisSaveDTO() {
    }

    public int getVideoId() {
        return videoId;
    }

    public void setVideoId(int videoId) {
        this.videoId = videoId;
    }

    public int getAnalysisId() {
        return analysisId;
    }

    public void setAnalysisId(int analysisId) {
        this.analysisId = analysisId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getFrontVideoId() {
        return frontVideoId;
    }

    public void setFrontVideoId(int frontVideoId) {
        this.frontVideoId = frontVideoId;
    }

    public int getSideVideoId() {
        return sideVideoId;
    }

    public void setSideVideoId(int sideVideoId) {
        this.sideVideoId = sideVideoId;
    }

    public String getClubType() {
        return clubType;
    }

    public void setClubType(String clubType) {
        this.clubType = clubType;
    }

    public String getBodyCode() {
        return bodyCode;
    }

    public void setBodyCode(String bodyCode) {
        this.bodyCode = bodyCode;
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

    public double getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(double totalScore) {
        this.totalScore = totalScore;
    }

    public double getAddressScore() {
        return addressScore;
    }

    public void setAddressScore(double addressScore) {
        this.addressScore = addressScore;
    }

    public double getBackswingScore() {
        return backswingScore;
    }

    public void setBackswingScore(double backswingScore) {
        this.backswingScore = backswingScore;
    }

    public double getDownswingScore() {
        return downswingScore;
    }

    public void setDownswingScore(double downswingScore) {
        this.downswingScore = downswingScore;
    }

    public double getImpactScore() {
        return impactScore;
    }

    public void setImpactScore(double impactScore) {
        this.impactScore = impactScore;
    }

    public double getxFactor() {
        return xFactor;
    }

    public void setxFactor(double xFactor) {
        this.xFactor = xFactor;
    }

    public double getXFactor() {
        return xFactor;
    }

    public void setXFactor(double xFactor) {
        this.xFactor = xFactor;
    }

    public String getOrbit() {
        return orbit;
    }

    public void setOrbit(String orbit) {
        this.orbit = orbit;
    }

    public String getFlexibility() {
        return flexibility;
    }

    public void setFlexibility(String flexibility) {
        this.flexibility = flexibility;
    }

    public String getFrontVideoUrl() {
        return frontVideoUrl;
    }

    public void setFrontVideoUrl(String frontVideoUrl) {
        this.frontVideoUrl = frontVideoUrl;
    }

    public String getSideVideoUrl() {
        return sideVideoUrl;
    }

    public void setSideVideoUrl(String sideVideoUrl) {
        this.sideVideoUrl = sideVideoUrl;
    }

    public String getAnalysisStatus() {
        return analysisStatus;
    }

    public void setAnalysisStatus(String analysisStatus) {
        this.analysisStatus = analysisStatus;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public List<String> getFeedbacks() {
        return feedbacks;
    }

    public void setFeedbacks(List<String> feedbacks) {
        this.feedbacks = feedbacks;
    }

    public Map<String, Object> getSectionDetails() {
        return sectionDetails;
    }

    public void setSectionDetails(Map<String, Object> sectionDetails) {
        this.sectionDetails = sectionDetails;
    }
}