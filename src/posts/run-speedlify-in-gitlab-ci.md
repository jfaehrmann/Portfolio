---
title: Web Vitals Monitoring with Speedlify and Gitlab CI
picture: /assets/img/race-track.jpg
date: 2021-01-18T07:20:00.665Z
summary: >-
  This is a step by step guide of how to set up Speedlify to monitor Web Vitals over time and automate it with Gitlab CI.
tags:
  - web vitals
  - speedlify
---
## New year, new motivation 
One of my new year's resolutions is to write more (and qulitative) posts. Let's start with a topic that in my eyes was always and is still very imortant: Performance Monitoring. 
Especially during a time where a new frontend framework hits the market seemingly every month, sending a lot of Javascript to the user, we have to keep in mind how expensive Javascript could be. Thanks to [Zach Leatherman](https://www.zachleat.com/) there is a simple way to monitor performance and other relevant metrics over time. With [Speedlify](https://github.com/zachleat/speedlify/) we can easily set up an environment which allows us to keep an eye on (Core) Web Vitals. 

## What are these Web Vitals? 
Web Vitals what? Core Web Vitals is initiated by Google and defines three aspects (in 2020) which should help website owners to improve their website performance and thus the user experience. Currently the set focuses on loading (Largest Contentful Paint), interactivity (First Input Delay), and visual stability (Cumulative Layout Shift). Read more about it in this article on [web.dev: Core Web Vitals](https://web.dev/vitals/). Let's jump over to Speedlify. 

## Introduction to Speedlify 
Speedlify is a monitoring tool by Zach Leatherman to continuously measure site performance and other Core Web Vitals over time. This is my instance for example: [speedlify.jonasfaehrmann.com](https://www.speedlify.jonasfaehrmann.com/). When you follow the link you will see the starting page of Speedlify where all projects/categories are listed. In this case there is only one category, my website. Click the link and you'll see all sites which i already measure over time. If your are familiar with Lighthouse you maybe realized the Lighthouse similar results on the right. Speedlify uses Lighthouse and some other tools under the roof to run tests and collect results. To see the latest data just click "Data and Graphs" and the content will expand. 

## Set up Speedlify 
This is pretty cool, right? And it's easy to set up. Go to [Speedlify Github Page](https://github.com/zachleat/speedlify/), clone the repository and you are nearly ready to go. In my case i run two different projects/repositories: one for my website and one for the Speedlify instance. But you are of course free to go and do it how you prefer.  
After you've successfully cloned the repository just run `npm install` and navigate to _data/sites. In this folder you'll find a single `.js` file for each category. This is how mine looks like: 
```js
module.exports = {
  name: "jonasfaehrmann.com",
  description: "Jonas’ Personal web site",
  skip: false,
  options: {
    freshChrome: "site",
    chromeFlags: ["--headless", "--no-sandbox"],
  },
  urls: [
    "https://jonasfaehrmann.com/",
    "https://jonasfaehrmann.com/blog/"
  ]
};
```
Because i want to run Speedlify in my Gitlab CI it was necessary to add the `--no-sandbox` chromeFlags option. Otherwise Speedlify will fail and the pipeline crashes.
To run, build and start Speedlify just follow these steps: 
```yaml
1. npm run test-pages
2. npm run build
3. npm run start
```
With `test-pages` Speedlify will run for each category and site and the results will be stored as `.json` files in _data/_results. Speedlify uses a static site generator ([eleventy/11ty](https://www.11ty.dev/)) which, by the way, is also created by Zach and [chartist.js](https://www.npmjs.com/package/chartist) to visualize the data. If all scripts ran successfull you should have a static build folder (_site) and a server which runs on [http://localhost:8080/](http://localhost:8080/). And that's it. Now you should see something similar to my instance. For more information about Speedlify visit Github or take a look at [Zachs post](https://github.com/zachleat/speedlify/). 

## Customized Speedlify 
So far so good. Let's talk about the tricky part now. Zach describes a way to deploy Speedlify with [Netlify and IFTTT](https://github.com/zachleat/speedlify#deploy-to-netlify). For this he added some Netlify restrictions, but i wanted to run and deploy Speedlify in my Gitlab CI. So what did i do? 
First of all i removed the Netlify specific parts of `run-test.js` to be able to run Speedlify whenever i want, without time limit or other restrictions. I also made some custom adjustments to the script so that i can to save all results in a `.zip` file and fetch it for each build: 
```js
(async () => {
  try {
    // get zipped results
    const zippedResults = await fastglob("_data/results.zip");
    if (zippedResults.length === 0) console.log("No previous results!");
    for (let results of zippedResults) {
        console.log("Collecting previous results.");
        zl.extract(results, "_data/results").then(function () {
            console.log("Success. Ready for lighthouse test runs.");
        }, function (error) {
            console.log(error);
        });
    }

    // run Speedlify tests
    await runSpeedlifyTests();

    zl.archiveFolder("_data/results", "_data/results.zip").then(function () {
        console.log(`Results saved to "_data/results.zip".`);
    }, function (error) {
        console.log(error);
  });

  } catch (error) {
    console.error(error);
  }
})();

```
What is happening here? First of all the script looks for previous results and unzips them for the the following eleventy build step. In the next step the function `runSpeedlifyTests`, which contains the customized `run-test.js` script, executes Speedlify. At the end all results will be zipped again. For zipping and unzipping the files i use [zip-lip](https://www.npmjs.com/package/zip-lib). 

## Configure gitlab-ci.yml 
At this point i have zipped results after each run. Because i did not use a database, the `results.zip` needs to be saved anywhere. I have chosen the repository and my server to store and update the file after each pipeline run. Maybe it is not the best way, but since this is not sensitive data, i think it is ok. 
Now let's take a look at the `gitlab-ci.yml`. First of all there are four stages:  
```yaml
stages:
  - test
  - push
  - build
  - deploy
```
The test stage installs npm dependencies and runs the Speedlify tests with `npm run test-pages`: 
```yaml
lighthouse-run:
  stage: test
  image: femtopixel/google-lighthouse
  only:
    - master
  script:
    - npm ci
    - npm run test-pages
  artifacts:
    expire_in: 1 week
    paths:
      - _data/results.zip
      - _data/results
```
The docker image i have configured for this job is [femtopixel/google-lighthouse](https://hub.docker.com/r/femtopixel/google-lighthouse). I use the Gitlab free plan and fortunately job artifacts are part of this plan. I will use the artifacts created in this job in the following stages.
With the next stage i commit and push the previous created `results.zip` to save it in my repository: 
```yaml
results-push:
  stage: push
  image: node:latest
  only:
    - master
  dependencies:
    - lighthouse-run
  before_script:
    - apt-get update
    - apt-get install git
    - git remote set-url origin https://GITLAB_USERNAME:${CI_PUSH_TOKEN}@gitlab.com/GITLAB_USERNAME/PROJECT_NAME.git
    - git config --global user.email "GITLAB_USER_EMAIL"
    - git config --global user.name "GITLAB_USERNAME"
  script:
    - git add _data/results.zip
    - git commit -m "save speedlify results [skip ci]"
    - git push --follow-tags origin HEAD:master
```
You can find a lot articles and ways how to commit and push from your Gitlab CI. This was the fastest and easiest for me. In the `before_script` block, git must first be installed and configured. I use the Gitlab Access Tokens, which can be set up in `User Settings -> Access Tokens`, to set up the git remote. Just create a new token, copy the value and save it as a project variable to keep it secret. You can now use the variable in your ci configuration like this `${CI_PUSH_TOKEN}`. It is absolutely necessary to add `[skip ci]` to the commit message. Otherwise the pipeline will run into an infinite loop.
In the third stage i simply just build the static site: 
```yaml
eleventy-build:
  stage: build
  image: node:latest
  dependencies:
    - lighthouse-run
  script:
    - npm run build
  artifacts:
    expire_in: 1 week
    paths:
      - _site
```
The Speedlify/eleventy build (`npm run build`), which i introduced you above, accesses the artifacts `_/data/results` from the `lighthouse-run` job before. I keep the static build from this job as an artifact for the last stage where i finally deploy it to my webserver. Nothing fancy, just static `html` files copied to a path to which my Speedlify subdomain [speedlify.jonasfaehrmann.com](https://www.speedlify.jonasfaehrmann.com/) points. That's it. 

## Schedule and Trigger Pipeline 
As a last step i have set up a Gitlab scheduled pipeline to measure the metrics at least once a day. Just navigate to your project, select CI/CD -> Schedules and create a new Schedule with descrption, an interval pattern, some other settings and hit save. Your schedule will trigger the pipeline, see also [Gitlab Scheduled Pipeline](https://docs.gitlab.com/ee/ci/pipelines/schedules.html). If you also want to get new results right after a deployment you can make us of [Gitlab Triggers](https://docs.gitlab.com/ee/ci/triggers/). 
And that's it. Thank you for reading. 




<!-- ![alt text](/assets/img/browser.jpg "Logo Title Text 1") -->
