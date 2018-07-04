import pluginCall from 'sketch-module-web-view/client';

// send event from webview back to plugin
pluginCall('nativeLog', 'Called from the webview');

// you can pass any argument that can be stringified
var a = "foo";
var b = 'bar';
pluginCall('nativeLog', {
  a: b,
});

// you can also pass multiple arguments
pluginCall('nativeLog', 1, 2, 3);
