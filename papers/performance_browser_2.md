<!-- cspell: words Quadro, Radeon, Ryzen -->

# Execution Performance - Browser, second edition
Written 4 January 2026.  This paper builds on the [first edition paper](./performance_browser_1.md) written on 18 February 2023.

## Preface
The first edition performance paper features measures from a prior application named [Share File Systems](https://github.com/prettydiff/share-file-systems).
This paper focuses upon a new application featuring a greater diversity of content and points of interaction named [Aphorio](https://github.com/prettydiff/aphorio) with [screenshots available](https://prettydiff.github.io/aphorio/screenshots/index.html).
This paper references the Aphorio application from commit *e82803ebb59c6e47c8500f9282734e5bf9a0b8d7* added to the application's main branch on 3 January 2026.

## Measures
### Setup
#### Aphorio Features
Sections of content, referred to as *features* within the application, are al a cart and can be easily eliminated by changing a single value in the application's `features.json` configuration file.
At the time of this writing Aphorio contains 22 features of which 20 can be disabled from the mentioned `features.json` file.
The remaining two features are static HTML content containing no points of user interaction.

In addition to measuring from a different application the measures also come from different hardware than the prior paper.

#### Windows 11 Hardware
* OS - Windows 11 Home, 10.0.26100
* CPU - AMD Ryzen 9 9900X @ 4.392ghz (12 Cores)
* Memory - 32GB DDR5 @ 4.8ghz
* GPU - AMD Radeon RX 7600XT, driver version 32.0.21030.2001
* Browser - Chromium 145.0.7601.0

#### Debian 13 Hardware
* OS - Debian 13, version 12.7
* CPU - Intel E3-1270 @ 3.8ghz (4 Cores)
* Memory - 32GB DDR4 @ 2.4ghz
* GPU - NVidia Quadro P620
* Browser - Chromium 145.0.7601.0

### Load Times
All times are from localhost addresses.
The 2 charts below contain different measures each achieved from the same page refresh action.
Times from across a network sharing the same router are about 10-20% greater.

* **All Content** measures the application with all values in the `features.json` set to true.
   * 1 initial HTTP response 1 - 1.1mb in size.
   * 2 Web Socket connections.
* **Most Content** measures the application with the 3 largest sections removed: Services, Statistics, and Terminal
   * 1 initial HTTP response about 545kb in size.
   * 1 Web Socket connection.
* **Minimal Content** measures the application with all values in the `features.json` set to false.
   * 1 Initial HTTP response 176kb in size.

#### Page Load
These times come from JavaScript property `performance.getEntries()[0].duration` rounded to tenths of milliseconds and averaged from 10 measures.

| OS         | Minimal Content | Most Content | All Content |
| ---        | ---             | ---          | ---         |
| Windows 11 | 23.2ms          | 44.4ms       | 77.1ms      |
| Debian 13  | 43.3ms          | 86.7ms       | 190.5ms     |

##### Raw Data
| OS         | Content         | 1     | 2     | 3     | 4     | 5     | 6     | 7     | 8     | 9     | 10    |
| ---        | ---             | ---   | ---   | ---   | ---   | ---   | ---   | ---   | ---   | ---   | ---   |
| Windows 11 | Minimal Content | 26.3  | 19.4  | 26.1  | 22.9  | 22.3  | 26.0  | 20.9  | 22.9  | 23.0  | 22.3  |
| Windows 11 | Most Content    | 46.1  | 45.3  | 45.5  | 45.7  | 41.0  | 44.7  | 44.4  | 43.5  | 44.4  | 43.0  |
| Windows 11 | All Content     | 78.1  | 76.1  | 78.7  | 77.7  | 76.3  | 77.0  | 74.4  | 76.7  | 76.6  | 79.6  |
| Debian 13  | Minimal Content | 43.3  | 44.1  | 45.6  | 42.7  | 40.9  | 40.5  | 44.8  | 45.1  | 42.2  | 43.4  |
| Debian 13  | Most Content    | 83.9  | 84.9  | 88.4  | 82.8  | 88.0  | 87.8  | 89.9  | 86.3  | 82.1  | 92.6  |
| Debian 13  | All Content     | 184.1 | 182.0 | 183.5 | 196.3 | 185.6 | 201.2 | 202.0 | 211.4 | 177.9 | 181.2 |

#### Complete Initial Execution
These times come from the Performance tab of the Chrome DevTools and averaged from 10 measures.

| OS         | Minimal Content | Most Content | All Content |
| ---        | ---             | ---          | ---         |
| Windows 11 | 51.1ms          | 76.9ms       | 126.4ms     |
| Debian 13  | 78.2ms          | 152.7ms      | 300.9ms     |

##### Raw Data
The raw numbers include time from unspecified browser tasks related to the JavaScript execution, which includes garbage collection and related internal tasks.

| OS         | Content         | 1     | 2     | 3     | 4     | 5     | 6     | 7     | 8     | 9     | 10    |
| ---        | ---             | ---   | ---   | ---   | ---   | ---   | ---   | ---   | ---   | ---   | ---   |
| Windows 11 | Minimal Content | 52.7  | 46.4  | 55.7  | 49.7  | 56.8  | 53.4  | 47.7  | 49.5  | 48.4  | 50.9  |
| Windows 11 | Most Content    | 79.4  | 74.8  | 79.3  | 80.2  | 74.2  | 78.0  | 74.6  | 76.2  | 77.7  | 74.5  |
| Windows 11 | All Content     | 127.1 | 132.9 | 127.3 | 126.0 | 121.6 | 125.2 | 120.3 | 126.9 | 125.7 | 130.6 |
| Debian 13  | Minimal Content | 78.4  | 66.1  | 81.6  | 77.4  | 78.3  | 76.1  | 82.7  | 81.0  | 77.4  | 82.8  |
| Debian 13  | Most Content    | 150.8 | 159.3 | 149.0 | 146.8 | 153.4 | 152.9 | 163.5 | 150.9 | 148.4 | 151.5 |
| Debian 13  | All Content     | 296.8 | 292.5 | 285.8 | 303.0 | 297.8 | 308.4 | 314.8 | 328.7 | 276.1 | 304.8 |

### Bias
#### Static Versus Dynamic Content
The application uses state management to determine which content feature to display on page refresh, based upon the user's last active content feature.
If the page loads a content feature that is primarily static content, like a data table, the time to complete initial execution is about 15% faster compared to a feature that requires substantial dynamic rendering.
For example these measures, gathered from the page with *Interfaces* feature loading, averaged at 126.4ms total time compared to about 145ms for executing the page to the *Terminal* feature.
Most features of the application comprise static content so the faster measure was used.

#### Memory Speed
The Windows 11 tests executed about 2.4 times faster than equivalent tests on the Debian 13 machine.
This performance difference is primarily attributed to the Windows 11 machine having memory at double the execution frequency, a substantially more powerful CPU, and a dramatically superior graphics card.
To accurately determine if these tests perform faster on Windows versus Linux equivalent hardware should be used.

## Application Design for High Performance
First, read the [first edition paper](./performance_browser_1.md) to help find obvious performance opportunities.
The Aphorio application learns from the first edition paper and then applies these concepts at a higher level of code organization.

### HTML
The first action to take is plan the content output by writing HTML.
The Aphorio makes very little attempt to reuse HTML content in various areas of the application.
Instead HTML content is unique to each content feature or part of a universal area, such as the title bar or navigation menu.
This HTML is not abstracted into any kind of template. 
This also allows proper consideration of accessibility as a first concern.

### TypeScript
The TypeScript for a given content feature follows one of two interface models.
The content that displays almost exclusively as tabular data uses the application's *module_list* interface.
Other content uses the application's *module_sections* interface.
Code that does not make use of those interfaces, either directly or by extension, displays in a TypeScript aware editor as a type violation.

The interfaces are open to customization through creating a new interface that extends the base interface.
This allows for deviation from the base interfaces as necessary to support custom interactions, custom libraries, and not violate principles of feature isolation.

### DOM Access
The TypeScript code references DOM nodes only once, at feature code initialization.
DOM nodes necessary for interaction are assigned to properties in an object named *nodes* as designed by the *module_sections* interface.
By default all referenced DOM nodes are of TypeScript type *HTMLElement*, but this can customized in a feature specific interface that extends the *module_sections* interface.
Sometimes it is necessary to specifically identify to TypeScript that a given element is an *HTMLInputElement* or *HTMLTextareaElement* type opposed to a generic *HTMLElement* type to prevent TypeScript errors on accessing type specific DOM node properties, like *value*.
Performance, and code complexity, substantially benefit from restricted DOM access because everything else in the application code becomes an internal object property on a feature specific object.

### Bundling
The Aphorio application bundles the CSS, HTML, and TypeScript into a single file.
This is typically an anti-pattern as CSS and TypeScript/JavaScript code are preferred as separate file that can be cached in the browser.
In this case the benefits of total bundling outweigh the benefits of browser caching resulting in faster total execution time.
The initial payload of dynamic data is also included in the single bundled file, which saves on a separate data request after page load in the browser.

### Minified Code and Code Builds
The Aphorio application makes no use of code minification.
Code minification could benefit load speeds by reducing the size of code download across the internet, but otherwise it does not appear to significantly reduce time to parse/render.

The Aphorio application does make use of a build step.
The build step gathers information from settings files, OS data, and bundles the HTML.

There is no compile step to transform the TypeScript code into browser compliant JavaScript.
Node, since version 24.2.0, applies automatic type stripping for TypeScript code into JavaScript that it can immediately execute.
The Aphorio application imports the browser code, using ES6 module code, into its startup file where the TypeScript types are stripped and converts the corresponding JavaScript functions into a string for transport over a network interface.

## Summary
Based upon these measures and the noted additional considerations of network transfer and dynamic content rendering it is still feasible for large single page applications with diverse content to easily achieve complete initial page execution in less than half a second.
Additional media, such as images and external applications, will take longer still to complete execution and rendering.
Even with these considerations it is still completely practical for any large single page application to achieve complete execution and rendering within a second.

In addition to potentially increased performance the Aphorio application applies no layers abstractions which greatly increases speed of maintenance and accuracy of accessibility.
For example error messages in the browser accurately reflect the true line and column numbers of the actual working code.