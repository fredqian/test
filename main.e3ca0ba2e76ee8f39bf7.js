(window.webpackJsonp=window.webpackJsonp||[]).push([[0],[function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,a){function i(e){try{s(r.next(e))}catch(e){a(e)}}function c(e){try{s(r.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,c)}s((r=r.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var n,r,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function c(a){return function(c){return function(a){if(n)throw new TypeError("Generator is already executing.");for(;i;)try{if(n=1,r&&(o=2&a[0]?r.return:a[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,a[1])).done)return o;switch(r=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,r=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!(o=i.trys,(o=o.length>0&&o[o.length-1])||6!==a[0]&&2!==a[0])){i=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){i.label=a[1];break}if(6===a[0]&&i.label<o[1]){i.label=o[1],o=a;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(a);break}o[2]&&i.ops.pop(),i.trys.pop();continue}a=t.call(e,i)}catch(e){a=[6,e],r=0}finally{n=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,c])}}};Object.defineProperty(t,"__esModule",{value:!0});var a,i,c,s,l,u,d,f,v,b,p=n(1),h=n(2);n(3),"serviceWorker"in navigator&&window.addEventListener("load",(function(){return r(void 0,void 0,void 0,(function(){var e,t;return o(this,(function(n){switch(n.label){case 0:return n.trys.push([0,2,,3]),[4,navigator.serviceWorker.register("service-worker.js",{scope:"."})];case 1:return e=n.sent(),console.log("SW registered: ",e),[3,3];case 2:return t=n.sent(),console.log("SW registration failed: ",t),[3,3];case 3:return[2]}}))}))}));var m,w,g=1,y=new p.Terminal({scrollback:1e4}),E=new h.FitAddon;y.loadAddon(E);var k=new TextEncoder,I="";function B(e){for(var t=0;t<a.options.length;++t){var n=a.options[t];if("prompt"!==n.value){var r=n;if(r.port===e)return r}}return null}function x(e){var t=document.createElement("option");return t.textContent="Port "+g++,t.port=e,a.appendChild(t),t}function L(){if(!y)throw new Error("no terminal instance found");if(0!==y.rows){y.selectAll();var e=y.getSelection();y.clearSelection();var t=URL.createObjectURL(new Blob([(new TextEncoder).encode(e).buffer],{type:"text/plain"})),n=document.createElement("a");n.download="terminal_content_"+(new Date).getTime()+".txt",n.href=t,n.click()}else console.log("No output yet")}function C(){return r(this,void 0,void 0,(function(){var e;return o(this,(function(t){switch(t.label){case 0:if("prompt"!=a.value)return[3,5];t.label=1;case 1:return t.trys.push([1,3,,4]),[4,navigator.serial.requestPort({})];case 2:return m=t.sent(),[3,4];case 3:return t.sent(),[2];case 4:return(function(e){var t=B(e);return t||x(e)}(m)).selected=!0,[3,6];case 5:e=a.selectedOptions[0],m=e.port,t.label=6;case 6:return[2]}}))}))}function N(){return"custom"==c.value?Number.parseInt(s.value):Number.parseInt(c.value)}y.onData((function(e){if(v.checked&&y.writeUtf8(k.encode(e)),null!=(null==m?void 0:m.writable)){var t=m.writable.getWriter();b.checked?(I+=e,"\r"===e&&(t.write(k.encode(I)),t.releaseLock(),I="")):t.write(k.encode(e)),t.releaseLock()}else console.warn("unable to find writable port")})),document.addEventListener("DOMContentLoaded",(function(){return r(void 0,void 0,void 0,(function(){var e;return o(this,(function(t){switch(t.label){case 0:return(e=document.getElementById("terminal"))&&(y.open(e),E.fit()),document.getElementById("download").addEventListener("click",L),a=document.getElementById("ports"),(i=document.getElementById("connect")).addEventListener("click",(function(){m?function(){r(this,void 0,void 0,(function(){return o(this,(function(e){switch(e.label){case 0:return w&&w.cancel(),m?[4,m.close()]:[3,2];case 1:e.sent(),e.label=2;case 2:return[2]}}))}))}():function(){r(this,void 0,void 0,(function(){var e,t,n,r,v;return o(this,(function(o){switch(o.label){case 0:return[4,C()];case 1:return o.sent(),m?(e={baudRate:N(),dataBits:Number.parseInt(l.value),parity:u.value,stopBits:Number.parseInt(d.value),flowControl:f.checked?"hardware":"none",baudrate:N(),databits:Number.parseInt(l.value),stopbits:Number.parseInt(d.value),rtscts:f.checked},console.log(e),[4,m.open(e)]):[2];case 2:o.sent(),a.disabled=!0,i.textContent="Disconnect",c.disabled=!0,s.disabled=!0,l.disabled=!0,u.disabled=!0,d.disabled=!0,f.disabled=!0,y.writeln("<CONNECTED>"),o.label=3;case 3:if(!m.readable)return[3,11];o.label=4;case 4:o.trys.push([4,9,,10]),w=m.readable.getReader(),o.label=5;case 5:return[4,w.read()];case 6:if(t=o.sent(),n=t.value,r=t.done,n&&y.writeUtf8(n),r)return[3,8];o.label=7;case 7:return[3,5];case 8:return w=void 0,[3,10];case 9:return v=o.sent(),console.error(v),y.writeln("<ERROR: "+v.message+">"),[3,10];case 10:return[3,3];case 11:return y.writeln("<DISCONNECTED>"),a.disabled=!1,i.textContent="Connect",c.disabled=!1,s.disabled=!1,l.disabled=!1,u.disabled=!1,d.disabled=!1,f.disabled=!1,m=void 0,[2]}}))}))}()})),(c=document.getElementById("baudrate")).addEventListener("input",(function(){"custom"==c.value?s.hidden=!1:s.hidden=!0})),s=document.getElementById("custom_baudrate"),l=document.getElementById("databits"),u=document.getElementById("parity"),d=document.getElementById("stopbits"),f=document.getElementById("rtscts"),v=document.getElementById("echo"),b=document.getElementById("enter_flush"),[4,navigator.serial.getPorts()];case 1:return t.sent().forEach((function(e){return x(e)})),navigator.serial.addEventListener("connect",(function(e){x(e.port)})),navigator.serial.addEventListener("disconnect",(function(e){var t=B(e.port);t&&t.remove()})),[2]}}))}))}))}],[[0,1,2]]]);