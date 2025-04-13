# Encode AI Hackathon 2025 Submission - Tonk Toolchain App "Ranked Chores"

Our two-person team (@CobaltGitter and I) created a task manager app that utilizes a shared datastore for "mini-apps" within the app. This app includes a task manager, leaderboard, and chatroom, making it suitable for friends looking to make joint tasks more fun, or perhaps roommates looking to optimize their chore system. The app can be used via Tonk, and also accessed through the following link: [https://rnode-82-163-218-33.a.free.pinggy.link/](https://rnobt-193-221-143-82.a.free.pinggy.link/)

# Usage (a more generic description)

This tonk application allows you to set tasks, view tasks and mark tasks as completed.

You can assign different people tasks and assign these tasks with a rating -- some tasks have higher points than others, and other tasks have less points.

There is also a leaderboard funtion which allows for easy tracking of the progress of each user -- it also motivates your friends/family/roommates by encouraging the giving of prizes for the top performers.

## Approach

As per the Tonk documentation, we decided to almost entirely vibe-code the app. This was both of our first time using AI-integrated IDE software (we chose to use Windsurf), so it was a bit of a learning curve to understand how to approach making the app. We followed the tonk download guide off of the documentation, but ran into many issues with dependencies and trying to download it on Windows 11. This was largely fixed upon manually downloading the dependencies listed in errors. 

Creating the app within tonk was quite easy, and we pulled it into the IDE to begin vibe-coding shortly after. We had used Claude 3.5 Sonnet, but later switched to using Deepseek V3.

![image](https://github.com/user-attachments/assets/7b481953-9192-4472-9e65-b7317b6802da)
![image](https://github.com/user-attachments/assets/94a7539a-bb42-404e-bcf9-20ab02d8558d)


## Project Development

We both have very little experience with the web-based languages and frameworks that Tonk relies on, so we relied heavily upon vibe-coding for syntax and language support. Structurally we understood that we needed some kind of main app, with sub-apps operating from one shared datastore. 

![image](https://github.com/user-attachments/assets/fef65cc7-198a-4e9d-b655-8bf04d0c8411)
![image](https://github.com/user-attachments/assets/008d96bb-f51c-4a33-a6ae-8c5472b71ffa)
![image](https://github.com/user-attachments/assets/b1637d25-147c-4734-9e3a-18d1f87ba8bc)
![image](https://github.com/user-attachments/assets/fd051d94-e09a-4282-a1f5-94765ce52867)


## Errors and Initial Issues

We had several iterations of the app that had been made but were messed up due to wrong prompts and issues with implementing ideas. One idea that was largely scrapped was the idea of a map where tasks could be seen overlayed on a map embedded in the app. Another idea was a P2P connection established using user-IDs. However, the implementation was not working well and in the end we simplified the app in order to prioritize workability over more features. Some screenshots of old versions can be found below. One of them can be found in the github branches if you'd like to see it more in detail. (if you'd like to see videos of previous versions we can also supply those)

![image](https://github.com/user-attachments/assets/1c2e31f8-7708-4184-b439-e57622df157f)
![image](https://github.com/user-attachments/assets/1afb392b-a88f-42e2-94d3-81cce30c3422)
![image](https://github.com/user-attachments/assets/6683e50a-9bf5-441d-a814-8903ffb10e8b)
![image](https://github.com/user-attachments/assets/e5d0d3aa-b41b-4f50-b4e6-9debe026626f)



