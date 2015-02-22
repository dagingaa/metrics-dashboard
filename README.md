Metrics dashboard
=================
This is an experimental metrics dashboard written with SystemJS, React and
ECMAScript 6. It allows the user to view metrics data from a server, which is
periodically polled. But in truth, it's an experimental deep-dive into what is
possible using the very latest in browser technologies right now.

How it works
------------
The dashboard itself works by configuring it inside config.js. Point it to a
CORS-enabled endpoint, which should return a json blob. Use metrics to set up
the paths you want to show in the dashboard, together with a short description.
The app will then poll the server every pollingDuration, measured in ms and
update the dashboard.

As for looking at the code, you will see some original solutions here. We use
the quasi-template string support in traceur to on-the-fly convert our JSX-like
template strings into something React can understand, which is then rendered.
We also use basic ECMAScript 6 classes which is then passed to React to set up
the Components.

In other words, we try to use as much of native ES& code as possible, with no
transpilation step if possible.

Performance?
------------
While it cannot be seen by the user in such a simple application as this, I
believe that doing the inline JSX transform for all components, on every update
can be quite costly. It would be nicer if we had the possibility to transform
the template strings once, but keep the references to make the app faster. This
is possible with the JSX transpilation step, but maybe not with ES6 template
strings.

So, in other words: I have no idea, please don't do this in production.

Running the thing
-----------------
For development, I have used live-server to load up the index.html, but any
static file hoster should do. However, make note that without the bundling part,
SystemJS will make 185 requests, so the initial load can be quite slow unless
you use something that supports HTTP/2.

Is this a hack?
---------------
Indubitably.
