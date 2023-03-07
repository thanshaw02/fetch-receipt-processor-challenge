# Receipt Processor Challenge

This repository holds my source code for a take-home exam for _Fetch Rewards_, this assignment runs a server using _Go_ and adds to endpoints to this server to:

1. Send a _Receipt_ JSON object to the `/receipts/process` POST endpoint which parses the receipt object and pools up points given a point ruleset via the assignment instructions
    - This endpoint returns a JSON object containing the _ID_ of the receipt that was submitted which is used to reference later in the GET endpoint.
    - Errors are also handled for missing attributes in the POST's JSON body, errors parsing the _date_ and _time_ attributes, and other internal server errors that may occur.
2. Fetch the points associated with a submitted _Receipt_ from the `/receipts/{id}/points` endpoint using the id returned from hitting the POST endpoint above. This endpoint returns a JSON object that contains the total pooled points that the receipt submitted earlier accrued.
    - Errors are also handled here, including if the id sent via the endpoint's path doesn't match an entry in the _in-memory store/map of receipts_

**Note:**
- The code that's directly related to this assignment can be found in: `receipt-api.go`, `/receiptstructs/structs.go`, and `/receiptstructs/methods.go`
- The _frontend_ aspect of this assignment is strictly for testing the Go backend endpoints
- Instructions below go into detail on how to test the _Go_ server endpoints using both _curl_ and the _frontend_

## How to run the Receipt API server using Docker

1. Within the `fetch-receipt-processor-challenge` directory build the Docker image by running `docker build --tag fetch-receipt-api .`

2. Confirm that a Docker image was created by running this command from the same directory `docker image ls`

3. If you see a new entry in the table printed with the name `fetch-receipt-api` and the tag `latest` then the docker build _should_ have worked, you should see something like this printed in your console:

> fetch-receipt-api  ||  latest  ||  27a893d09711  ||  6 seconds ago  ||  851MB

4. Run the docker image using this command from the same directory `docker run -d -p 8000:8000 fetch-receipt-api`
    - This will start the Docker image connecting the Docker container's port _8000_ to your machine's _8000_ port, this also allows the image to run in the background freeing up your console instead of forcing you to open a new one.
    - You do not need to specify the host here, although if you prefer to specify _localhost_ or _127.0.0.1_ that will still work.

5. Verify that you see the Docker container running in the _Docker Desktop_ app

**Docker/Go Notes:**
- This assumes you already have docker installed and know how to use it/know the basics around Docker and also have Go installed and configured
- For instructions on how to install and configure Go using Windows Subsystem for Linux (WSL) [this link proved very helpful to myself](https://www.jetbrains.com/help/go/how-to-use-wsl-development-environment-in-product.html)

## How to run the Receipt API server without Docker

1. Within the `fetch-receipt-processor-challenge` directory simply run this command `go run receipt-api.go`

**Go Notes:**
- This assumed you have _Go_ installed and configured on your machine
- For instructions on how to install and configure Go using Windows Subsystem for Linux (WSL) [this link proved very helpful to myself](https://www.jetbrains.com/help/go/how-to-use-wsl-development-environment-in-product.html)

## How to run the Receipt API frontend

- From within the `receipt-frontend` directory run `yarn install`
- Run `yarn start` in the same `receipt-frontend` directory
- Navigate to `localhost:3000`

**Note:**
- The frontend relies on the _Go_ backend server, so make sure before using the frontend you build and run the backend Docker container

# How to test the Receipt API

## Using curl

1. From your console run this `curl` command to hit the `/receipts/process` POST endpoint:
    - This command specifically holds the same _Receipt_ data used in _example one_ of the assignment
    - **Note:** This command uses the _verbose_ option so you can see everything sent back

> curl -v -d '{"retailer": "Target", "purchaseDate": "2022-01-01", "purchaseTime": "13:01", "items": [{"shortDescription": "Mountain Dew 12PK", "price": "6.49"}, {"shortDescription": "Emils Cheese Pizza", "price": "12.25"}, {"shortDescription": "Knorr Creamy Chicken", "price": "1.26"}, {"shortDescription": "Doritos Nacho Cheese", "price": "3.35"}, {"shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ", "price": "12.00"}], "total": "35.35"}' -X POST 'http://localhost:8000/receipts/process'

2. Verify you are sent back a JSON object that follows this format below:

> { "id" : "1c23395b-7b6e-47bf-887c-f8e7608c809c" }

3. Copy the _uuid_, this will be used to hit the `/receipts/{id}/points` GET endpoint

4. From the console run this `curl` command to hit the `/receipts/{id}/points` endpoint using the id received from the previous POST request:
    - **Note:** The _uuid_ between _receipts_ and _points_ in this path must be the id from earlier

> curl -v -X GET 'http://localhost:8000/receipts/1c23395b-7b6e-47bf-887c-f8e7608c809c/points'

5. Verify you are sent back a JSON object that follows this format below:

> { "points" : "28" }

6. In this case `28` should be the correct amount of points that the receipt sent earlier has

### Further testing

I will include another POST curl command that represents _example two_ from the assignment, this receipt should accrue `109` points -- so verify this is what you see after sending your GET request.

> curl -v -d '{"retailer": "M&M Corner Market", "purchaseDate": "2022-03-20", "purchaseTime": "14:33", "items": [{"shortDescription": "Gatorade", "price": "2.25"}, {"shortDescription": "Gatorade", "price": "2.25"}, {"shortDescription": "Gatorade", "price": "2.25"}, {"shortDescription": "Gatorade", "price": "2.25"}], "total": "9.00"}' -X POST 'http://127.0.0.1:8000/receipts/process'

Use the same GET `curl` command from the above section using the new id -- verify that `109` points are returned.

You may do further testing my creating your own receipt objects, counting the points that receipt object should accrue, then sending that object to the POST endpoint and fetching the accruied points via the GET endpoint. If you run into any issues please feel free to make a comment in this repository or you can reach me by email add tylorjhanshaw@gmail.com.

## Using the frontend

- After running the backend Docker container and starting the frontend fill out the fields to create a `Receipt` object
  - You will see error messages if a field is missing both in the main form and in the _add receipt items_ section
- Verify that the _total_ field towards the bottom is correct based off of the items entered above
- Click the `Submit Receipt` button to POST the receipt object to the backend
  - You will see a success message towards the top of the form if the POST request was successful
- Click the `View Receipt Points` button to view the accrued points for the submitted receipt

**Note:**
- You may submit as many receipt objects as you like, just make sure that the points accrued add up to the actual poinst accrued for the receipt

# Final Thoughts

This assignment was a **lot** of fun, prior to this I had not worked closely with Go at all. So this was a great learning experience, I tried to stick to Go best practices with naming conventions and file/package structures as best as I could -- although to get this submitted as soon as I could I cut out some steps I would have normally taken.

I'd really like to re-work or fully flesh out the error handling here, give more specific status codes when an error is thrown or just in general, I'd also like to modulize the project even more and split it up so the structure/file structure is more organized and intuitive. I'm also doing a sort of _hacky_ thing in the `PoolReceiptPoints` method when it comes to extracting the time from the _purchaseTime_ attribute of the receipt. I couldn't quite get the time formatting working how I wanted it to, but I was able to format it in a way where I could extract the hour and minute, but currently the hour I'm extracting is stored as the _minute_ attribute of the `time.Time` object.

It also took me a little while to get used to the upper vs. lowercase rule surrounding methods, objects, and object attributes. I'm still trying to work in the muscle memory for remembering to capitalize methods and attribute names if I want to export and use them in other areas of the codebase, that's isn't a big deal though.

# Helpful Links/Rules

- [This link includes the rules around how points are accrued for a given _Receipt_ object](https://github.com/fetch-rewards/receipt-processor-challenge#rules)
