var serial = {};

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

(function() {
  'use strict';

  serial.status = 0; //disconnected

  serial.CP210_VENDOR_WRITE_REQUEST_TYPE = 0x40;
  serial.CP210_VENDOR_WRITE_REQUEST      = 0x01;
  serial.CP210_VENDOR_READ_REQUEST_TYPE  = 0xc0;
  serial.CP210_VENDOR_READ_REQUEST       = 0x01;
  serial.CP210_GET_LINE_REQUEST_TYPE     = 0xa1;
  serial.CP210_GET_LINE_REQUEST          = 0x21;
  serial.CP210_SET_LINE_REQUEST_TYPE     = 0x21;
  serial.CP210_SET_LINE_REQUEST          = 0x20;
  serial.CP210_SET_CONTROL_REQUEST_TYPE  = 0x21;
  serial.CP210_SET_CONTROL_REQUEST       = 0x22;
  serial.CP210_BREAK_REQUEST_TYPE        = 0x21;
  serial.CP210_BREAK_REQUEST             = 0x23;

  serial.CH341_REQ_READ_VERSION = 0x5F;
  serial.CH341_REQ_WRITE_REG    = 0x9A;
  serial.CH341_REQ_READ_REG     = 0x95;
  serial.CH341_REQ_SERIAL_INIT  = 0xA1;
  serial.CH341_REQ_MODEM_CTRL   = 0xA4;
  serial.CH341_REG_BREAK        = 0x05;
  serial.CH341_REG_LCR          = 0x18;

  serial.CH341_LCR_ENABLE_RX    = 0x80;
  serial.CH341_LCR_ENABLE_TX    = 0x40;
  serial.CH341_LCR_MARK_SPACE   = 0x20;
  serial.CH341_LCR_PAR_EVEN     = 0x10;
  serial.CH341_LCR_ENABLE_PAR   = 0x08;
  serial.CH341_LCR_STOP_BITS_2  = 0x04;
  serial.CH341_LCR_CS8          = 0x03;
  serial.CH341_LCR_CS7          = 0x02;
  serial.CH341_LCR_CS6          = 0x01;
  serial.CH341_LCR_CS5          = 0x00;

  serial.CH341_BIT_CTS = 0x01;
  serial.CH341_BIT_DSR = 0x02;
  serial.CH341_BIT_RI  = 0x04;
  serial.CH341_BIT_DCD = 0x08;

  serial.CH341_BAUDBASE_FACTOR  = 1532620800;
  serial.CH341_BAUDBASE_DIVMAX  = 3;

  serial.CH341 = 0x1;
  serial.CP201 = 0x2;

  //CH341
  //https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/drivers/usb/serial/ch341.c?h=v5.3-rc1
  //cp210
  //https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/drivers/usb/serial/cp210x.c?h=v5.3-rc1

  //requestType standard/class/vendor            0=standard, 1=class, 2=vendor, 3=reserved)
  //recipient device/inteface/endpoint/other 0=device, 1=interface, 2=endpoint,3=other)

  serial.getPorts = function() {
    return navigator.usb.getDevices().then(devices => {
      return devices.map(device => new serial.Port(device));
    });
  };

  serial.requestPort = function() {
    const filters = [
    ];
    return navigator.usb.requestDevice({ 'filters': filters }).then(
      device => new serial.Port(device)
    );
  }

  serial.Port = function(device) {
    this.device = device;
    if ((device.vendorId == 0x067b) && (device.productId == 0x2303))
    {
      this.device.t = serial.CP201;
    }
    if ((device.vendorId == 0x1a86) && (device.productId == 0x7523))
    {
      this.device.t = serial.CH341;
    }
  };

  serial.Port.prototype.connect = function(){
  	this.device.open().then(() => {
  		if (this.device.configuration === null) {
            return this.device.selectConfiguration(1);
        }
    }).then(() => this.device.claimInterface(0))
    .then(() => this.device.selectAlternateInterface(0,0))
  	.catch(error => {
  		console.log("ERROR "+error);
  	})
  };

  serial.Port.prototype.claim = function(i) {
    this.device.claimInterface(i)

    .catch(error => {
      console.log("ERROR "+error);
    })
    
  }

  serial.Port.prototype.close = function() {
    return this.device.close();
  }

  serial.Port.prototype.reset = function() {
    return this.device.reset();
  }

  serial.Port.prototype.disconnect = function() {
    return this.device_.controlTransferOut({
            'requestType': 'class',
            'recipient': 'interface',
            'request': 0x22,
            'value': 0x00,
            'index': 0x02})
        .then(() => this.device.close());
  };

  serial.Port.prototype.send = function(data) {
    return this.device.transferOut(4, data);
  };

  serial.Port.prototype.vendorWrite = function(value,index) {
    console.log("Write idx "+index+" val = "+value)
  	return this.device.controlTransferOut({
            'requestType': 'vendor',
            'recipient': 'device',
            'request': serial.VENDOR_WRITE_REQUEST,
            'value': value,
            'index': index,
    });
  };

  serial.Port.prototype.vendorRead = function(value) {
    console.log("Read val="+value);
  	return this.device.controlTransferIn({
      'requestType': 'vendor',
      'recipient': 'device',
      'request':serial.VENDOR_READ_REQUEST,
      'value':value,
      'index':0,
    },1);
  };

  serial.Port.prototype.checkDevice = function() {
  };

  serial.Port.prototype.patchDevice = function() {
  };

  serial.Port.prototype.getLineRequest = function() {
    console.log("Get line request");
    return this.device.controlTransferIn({
      'requestType': 'class',
      'recipient': 'interface',
      'request':serial.GET_LINE_REQUEST,
      'value':0,
      'index':0,
    },7);
  };

  serial.Port.prototype.setLineRequest = function() {
    console.log("Set line request");
    return this.device.controlTransferOut({
      'requestType': 'class',
      'recipient': 'interface',
      'request':serial.SET_LINE_REQUEST,
      'value':0,
      'index':0,
    },7);
  };

  serial.Port.prototype.setControlRequest = function() {
    console.log("Set control request");
    return this.device.controlTransferOut({
      'requestType': 'class',
      'recipient': 'interface',
      'request':serial.SET_CONTROL_REQUEST,
      'value':0,
      'index':0,
    },7);
  };

  serial.Port.prototype.breakRequest = function() {
    console.log("Break request");
    return this.device.controlTransferOut({
      'requestType': 'class',
      'recipient': 'interface',
      'request':serial.BREAK_REQUEST,
      'value':0,
      'index':0,
    },7);
  };

  serial.Port.prototype.transferIn = function(reqtype,recp,req,val,idx,dataread) {
    console.log("transferIn");
    return this.device.controlTransferIn({
      'requestType': reqtype,
      'recipient': recp,
      'request':req,
      'value':val,
      'index':idx,
    },dataread);
  };
  serial.Port.prototype.transferInfClaIn = function(req,val,idx,dataread) {
    console.log("transferInfClaIn");
    this.transferIn("interface","class",req,val,idx,dataread);
  };



  serial.Port.prototype.transferOut = function(reqtype,recp,req,val,idx) {
    console.log("transferOut");
    return this.device.controlTransferOut({
      'requestType': reqtype,
      'recipient': recp,
      'request':req,
      'value':val,
      'index':idx,
    });
  };

  serial.Port.prototype.transferDevVenOut = function(req,val,idx) {
    console.log("transferDevVenOut");
    this.transferOut("vendor","device",req,val,idx);
  }

  serial.Port.prototype.transferIntClaOut = function(req,val,idx) {
    console.log("transferIntClaOut");
    this.transferOut("class","interface",req,val,idx);
  }

  serial.Port.prototype.bulkOut = async function(ep) {
    var buf = new ArrayBuffer(1);
    let r = await this.device.transferOut(ep,buf);
    console.log(buf);
    console.log(r);
    return r;
  }

  serial.Port.prototype.bulkIn = async function(ep,l) {
    let r = await this.device.transferIn(ep,l);
    console.log(r);
    return r;
  }

  serial.Port.prototype.EncodeBaudRate = function() {
  };

  //https://gist.github.com/fe1320e2539ce9afc529f51cce656bae 
  serial.Port.prototype.init = function() {
    this.vendorRead( 0x8484)
    .then(() => this.vendorWrite(0x0404 , 0))
    .then(() => this.vendorRead( 0x8484))
    .then(() => this.vendorRead( 0x8383))
    .then(() => this.vendorRead( 0x8484))
    .then(() => this.vendorWrite(0x0404 , 1))
    .then(() => this.vendorRead( 0x8484))
    .then(() => this.vendorRead( 0x8383))
    .then(() => this.vendorWrite(0      , 1))
    .then(() => this.vendorWrite(1      , 0))
    .then(() => this.vendorWrite(2      , 0x24))
    .then(r =>{ console.log("Done "+r);})
    .catch(err => {console.log("Error "+err);}); // 2,0x44
  };

  serial.Port.prototype.CH341controlIn = function(req,val,idx,dataread) {
    console.log("CH341controlIn");
    return this.device.controlTransferIn({
      'requestType': 'vendor',
      'recipient': 'device',
      'request':req,
      'value':val,
      'index':idx,
    },dataread);
  };

  serial.Port.prototype.CH341controlOut = function(req,val,idx) {
    console.log("CH341controlOut");
    return this.device.controlTransferOut({
      'requestType': 'vendor',
      'recipient': 'device',
      'request':req,
      'value':val,
      'index':idx,
    });
  };

  serial.Port.prototype.CH341configure = function() {
    //serial.Port.prototype.CH341configure = async() => {
    console.log("CH341configure");
    this.device.controlTransferIn({
      'requestType': 'vendor',
      'recipient': 'device',
      'request':serial.CH341_REQ_READ_VERSION,
      'value':0,
      'index':0,
    },2).then(res1 => {
      var v = new Uint8Array(res1.data.buffer);
      console.log("0x"+buf2hex(v));
    }).catch(err=>{
      console.log(err);
    });

    console.log("CH341_REQ_SERIAL_INIT")
    var res2;
    this.device.controlTransferOut({
      'requestType': 'vendor',
      'recipient': 'device',
      'request':serial.CH341_REQ_SERIAL_INIT,
      'value':0,
      'index':0,
    }).then(r => {res2=r;}).catch(err => {console.log(err)});
    //console.log(buf2hex(res2.));
    console.log(res2);
    //return res2;
  };

  serial.Port.prototype.CH341configure2 = async function() {
    console.log("CH341configure");
    //40 a4 ff9f 0000 0000 0
    let r1 = await this.transferDevVenOut(serial.CH341_REQ_MODEM_CTRL,0xff9f,0x0,0x0);
    console.log(r1);
    //40 9a 1312 6483 0000 0
    let r2 = await this.transferDevVenOut(serial.CH341_REQ_WRITE_REG,0x1312,0x6483,0x0);
    console.log(r2);
    //40 9a 2518 00c3 0000 0
    let r3 = await this.transferDevVenOut(serial.CH341_REQ_WRITE_REG,0x2518,0x00c3,0x0);
    console.log(r3);
    //40 a4 ff9f 0000 0000 0
    let r4 = await this.transferDevVenOut(serial.CH341_REQ_MODEM_CTRL,0xff9f,0x0,0x0);
    console.log(r4);
  }

  serial.Port.prototype.CH341setHandshake = function() {
  };

  serial.Port.prototype.CH341getStatus = function() {
    console.log("CH341getStatus");
    var res1;
    this.device.controlTransferIn({
      'requestType': 'vendor',
      'recipient': 'device',
      'request':serial.CH341_REQ_READ_REG,
      'value':0x0706,
      'index':0,
    },2).then(r=>{
      var v = new new Uint8Array(r.data.buffer);
      console.log(buf2hex(v));
    }).catch(err=>{
      console.log(err);
    });
    console.log(res1);
    return res1;
  };

  serial.Port.prototype.CH341getStatus2 = async function() {
    var dev = this.device;
    try {
      console.log("CH341getStatus");
      let res = await dev.controlTransferIn({
        'requestType': 'vendor',
        'recipient': 'device',
        'request':serial.CH341_REQ_READ_REG,
        'value':0x0706,
        'index':0,
      },2);
      console.log(res);
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  serial.Port.prototype.CH341getStatus2 = async function() {
    var dev = this.device;
    try {
      console.log("CH341getStatus");
      let res = await dev.controlTransferIn({
        'requestType': 'vendor',
        'recipient': 'device',
        'request':serial.CH341_REQ_READ_REG,
        'value':0x0706,
        'index':0,
      },2);
      console.log(res);
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  serial.Port.prototype.CH341readEP0 = async function() {
    try {
      console.log("CH341readEP0");
      let res = this.device.transferIn(2,32);
      console.log("Res:"+res);
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  serial.Port.prototype.CH341readEP1 = async function(data) {
    try {
      console.log("CH341readEP1");
      let res = await this.device.transferOut(2,data);
      console.log(res);
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  serial.Port.prototype.CH341readEP2 = async function() {
    try {
      console.log("CH341readEP2");
      let res = this.device.transferIn(1,8);
      console.log("Result from EP2");
      console.log(res);
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  serial.Port.prototype.CH341setBaudrateLCR = async function() {
    var factor  = serial.CH341_BAUDBASE_FACTOR / 38400;
    console.log(factor);
    var divider = serial.CH341_BAUDBASE_DIVMAX;
    factor = 0x10000 - factor;
    var a = (factor & 0xff00) | divider;
    console.log(a);
    a = a | 0x80;

    var lcr = serial.CH341_LCR_ENABLE_TX | serial.CH341_LCR_ENABLE_RX | serial.CH341_LCR_CS8;
    var lcr = serial.CH341_LCR_ENABLE_TX | serial.CH341_LCR_ENABLE_RX | serial.CH341_LCR_CS8;

    this.CH341controlOut(serial.CH341_REQ_WRITE_REG,0x1312,a);
    this.CH341controlOut(serial.CH341_REQ_WRITE_REG,0x2518,lcr);
  };

  serial.Port.prototype.CH341breakReg = async function() {
    var ch341_break_reg = (serial.CH341_REG_LCR << 8) | serial.CH341_REG_BREAK;
    console.log(ch341_break_reg);
    let r = await this.CH341controlIn(serial.CH341_REQ_READ_REG, ch341_break_reg, 0, 2);
    var u8 = new Uint8Array(r.data.buffer);
    console.log(u8);
    u8[0] = u8[0] | serial.CH341_NBREAK_BITS;
    u8[1] = u8[1] | serial.CH341_LCR_ENABLE_TX;
    console.log(u8);
    let r1 = await this.CH341controlOut(serial.CH341_REQ_WRITE_REG,ch341_break_reg, u8);
    console.log(r1);
    return r;
  }

  serial.Port.prototype.CH341setHandshake = async function(ctrl) {
    var mcr = 0;
    mcr = mcr | serial.CH341_BIT_CTS;
    mcr = mcr | serial.CH341_BIT_DSR;
    mcr = ~mcr;
    //let r1 = await this.CH341controlOut(serial.CH341_REQ_MODEM_CTRL, ~ctrl, 0);
    let r1 = await this.CH341controlOut(serial.CH341_REQ_MODEM_CTRL, mcr, 0);
    console.log(r1);
    return r1;
  }

})();