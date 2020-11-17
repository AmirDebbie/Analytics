# Analytics Challenge

## Introduction
This is my Typescript fullstack analytics system that presents usage analytics about a website by collecting events sent to the platform (similar to Mixpanel.com), built on top of the "Cypress Real World App".
It uses Node.Js with express and lowDB in the backend, and React with "recharts" and "react-google-maps" in the frontend.

The frontend displays a dashboard containing cards of charts showing different analytics.
After installing and running the app, register and login to the system, go to the side menu and click 'Analytics' to view the dashboard.

## Getting Started
 
you can use `npm run init` __in the project root__ to download both the client and server dependencies, or :   
- Setup server  
    1. `cd server`  
    3. `npm i` 
    3. `npm start` in `/server`. (yes, in server)
    4. `npm run test` - runs backend tests (required to pass).
- Setup client  
    1. `cd client`  
    3. `npm i` 
    3. `npm start` in `/client`. this can take a while
- After installing all dependencies, you can also use `npm run dev` in in either folder to run both concurrently.

- Note: do not delete the root folder's package.json, it is necessary.
  
### Other useful commands:
- /server
    - `npm run db:seed` - reseed the database (does not affect tests.) you can determine different parameters in [.env](server/.env). Useful in case the existing data is has very old dates and you want newer entries, or add properties you want to the data.

## Pictures
<br/>
<img width='800' src='./pictures/Screenshot 2020-11-10 135209.png'>
<img width='800' src='./pictures/Screenshot 2020-11-10 135237.png'>
<img width='800' src='./pictures/Screenshot 2020-11-10 135324.png'>
<img width='800' src='./pictures/Screenshot 2020-11-10 135420.png'>

