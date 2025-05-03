# Before I Do
## Run the development app and access it on iOS Simulator or the Expo Go sandbox
0. Install node v23.7.0 or later and npm 10.9.2 or later, following https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

1. Clone the repository
```bash
git clone https://github.com/maseratirex/Before-I-Do.git
cd <project-directory>
```

2. Install dependencies

Inside the project directory, install the node packages required for the app
```bash
npm install
```

3. Configure testing variables

Inside [app/(assessment)/section/[name].tsx](https://github.com/maseratirex/Before-I-Do/blob/main/app/(assessment)/section/%5Bname%5D.tsx), update the following variable to choose whether you would like the app to auto-fill dummy data for your questionnaire so as to skip filling out all 140+ questions.
Change
```js
const testing = false;
```
to testing true if you want to skip clicking all 140 buttons or testing false if you want the real experience.

4. Configure environment variables

See our client hand-off plan file in our Google Drive or linked in our hand-off project website for instructions on how to add the API key environment variable.

5. Run a live server in your console

Start the Expo server with
```bash
npx expo start
```
In the output, you'll find options to open the app in a

- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/), requiring XCode tools

6. Access the running app via 2 options
* Install Expo Go App (on iPhone) and scan the QR code in the running console. Currently this option does not work! The simulator app, Expo Go, on the iPhone App Store updated Friday, May 2nd. This causes a non-trivial bug to fix for Firebase and React Native; in fact, after working on it for several hours, one of our team members identified several Stackoverflow and Reddit posts talking about this same issue.
* Install XCode Tools and the iOS Simulator and type "i" in the running console