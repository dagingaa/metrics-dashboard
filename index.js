import AppComponent from 'lib/app';
import React from 'react';
import jsx from 'lib/jsx-quasi';

React.render(jsx`<${AppComponent}/>`, document.getElementById("app"));
