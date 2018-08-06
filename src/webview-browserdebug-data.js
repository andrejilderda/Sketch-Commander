// If in BROWSERDEBUG a few variables that are normally received from Sketch are set

if (BROWSERDEBUG) {
  let prevUserInput = "lr100, lr-100, tv=bla, x*200";
  let contextTabs = 0;
  let artboardLayerNameArray = 'testlayer 1,testlayer 2';
  var pageLayers = [{
    "type": "Artboard",
    "id": "8FBDA0A2-CAA7-4774-A965-F432874B5F48",
    "frame": {
      "x": -738,
      "y": -100,
      "width": 702,
      "height": 543
    },
    "name": "Artboard 1",
    "selected": false,
    "layers": [{
      "type": "Shape",
      "id": "A864D826-2D6C-4BA6-995B-0F7FC45D4B27",
      "frame": {
        "x": 227,
        "y": 270,
        "width": 209,
        "height": 165
      },
      "name": "elementInArtboard1",
      "selected": false,
      "flow": null,
      "hidden": false,
      "locked": false,
      "style": {
        "type": "Style",
        "id": "8A9C265E-E66E-4948-9BD9-22F73A1770C7",
        "opacity": 1,
        "blendingMode": "Normal",
        "borderOptions": {
          "startArrowhead": "None",
          "endArrowhead": "None",
          "dashPattern": [],
          "lineEnd": "Butt",
          "lineJoin": "Miter"
        },
        "blur": {
          "center": {
            "x": 0.5,
            "y": 0.5
          },
          "motionAngle": 0,
          "radius": 10,
          "enabled": false,
          "blurType": "Gaussian"
        },
        "fills": [{
          "fill": "Color",
          "color": "#d8d8d8ff",
          "gradient": {
            "gradientType": "Linear",
            "from": {
              "x": 0.5,
              "y": 0
            },
            "to": {
              "x": 0.5,
              "y": 1
            },
            "stops": [{
              "position": 0,
              "color": "#ffffffff"
            }, {
              "position": 1,
              "color": "#000000ff"
            }]
          },
          "enabled": true
        }],
        "borders": [],
        "shadows": [],
        "innerShadows": []
      }
    }, {
      "type": "Shape",
      "id": "22D928F2-1D7E-42AE-8CBD-C27C865744BD",
      "frame": {
        "x": 466,
        "y": 270,
        "width": 209,
        "height": 165
      },
      "name": "elementInArtboard2",
      "selected": false,
      "flow": null,
      "hidden": false,
      "locked": false,
      "style": {
        "type": "Style",
        "id": "82D20083-AB63-43FB-A09E-ED17DA8B7F7E",
        "opacity": 1,
        "blendingMode": "Normal",
        "borderOptions": {
          "startArrowhead": "None",
          "endArrowhead": "None",
          "dashPattern": [],
          "lineEnd": "Butt",
          "lineJoin": "Miter"
        },
        "blur": {
          "center": {
            "x": 0.5,
            "y": 0.5
          },
          "motionAngle": 0,
          "radius": 10,
          "enabled": false,
          "blurType": "Gaussian"
        },
        "fills": [{
          "fill": "Color",
          "color": "#d8d8d8ff",
          "gradient": {
            "gradientType": "Linear",
            "from": {
              "x": 0.5,
              "y": 0
            },
            "to": {
              "x": 0.5,
              "y": 1
            },
            "stops": [{
              "position": 0,
              "color": "#ffffffff"
            }, {
              "position": 1,
              "color": "#000000ff"
            }]
          },
          "enabled": true
        }],
        "borders": [],
        "shadows": [],
        "innerShadows": []
      }
    }, {
      "type": "Group",
      "id": "54213AA7-098B-437E-8DAB-86EB0DBFD4C5",
      "frame": {
        "x": 200,
        "y": 69,
        "width": 209,
        "height": 165
      },
      "name": "Group",
      "selected": false,
      "flow": null,
      "hidden": false,
      "locked": false,
      "style": {
        "type": "Style",
        "id": "6F8FA61D-1B7F-4E3D-B4A1-878DE349174F",
        "opacity": 1,
        "blendingMode": "Normal",
        "borderOptions": {
          "startArrowhead": "None",
          "endArrowhead": "None",
          "dashPattern": [],
          "lineEnd": "Butt",
          "lineJoin": "Miter"
        },
        "blur": {
          "center": {
            "x": 0.5,
            "y": 0.5
          },
          "motionAngle": 0,
          "radius": 10,
          "enabled": false,
          "blurType": "Gaussian"
        },
        "fills": [],
        "borders": [],
        "shadows": [],
        "innerShadows": []
      },
      "layers": [{
        "type": "Shape",
        "id": "5E6BA012-ED66-4826-ABBF-74737132EFAB",
        "frame": {
          "x": 0,
          "y": 0,
          "width": 209,
          "height": 165
        },
        "name": "groupBg",
        "selected": false,
        "flow": null,
        "hidden": false,
        "locked": false,
        "style": {
          "type": "Style",
          "id": "A8D84EFA-4C17-4075-AA0E-9BA614249115",
          "opacity": 1,
          "blendingMode": "Normal",
          "borderOptions": {
            "startArrowhead": "None",
            "endArrowhead": "None",
            "dashPattern": [],
            "lineEnd": "Butt",
            "lineJoin": "Miter"
          },
          "blur": {
            "center": {
              "x": 0.5,
              "y": 0.5
            },
            "motionAngle": 0,
            "radius": 10,
            "enabled": false,
            "blurType": "Gaussian"
          },
          "fills": [{
            "fill": "Color",
            "color": "#d8d8d8ff",
            "gradient": {
              "gradientType": "Linear",
              "from": {
                "x": 0.5,
                "y": 0
              },
              "to": {
                "x": 0.5,
                "y": 1
              },
              "stops": [{
                "position": 0,
                "color": "#ffffffff"
              }, {
                "position": 1,
                "color": "#000000ff"
              }]
            },
            "enabled": true
          }],
          "borders": [],
          "shadows": [],
          "innerShadows": []
        }
      }, {
        "type": "Text",
        "id": "A0DB9952-014F-4E8E-BC60-7E3050D17DBB",
        "frame": {
          "x": 40,
          "y": 71,
          "width": 129,
          "height": 19
        },
        "name": "textInsideArtboard",
        "selected": false,
        "flow": null,
        "hidden": false,
        "locked": false,
        "style": {
          "type": "Style",
          "id": "EB20E00F-EA82-4677-B5AE-43C9E9E5A8A4",
          "opacity": 1,
          "blendingMode": "Normal",
          "borderOptions": {
            "startArrowhead": "None",
            "endArrowhead": "None",
            "dashPattern": [],
            "lineEnd": "Butt",
            "lineJoin": "Miter"
          },
          "blur": {
            "center": {
              "x": 0.5,
              "y": 0.5
            },
            "motionAngle": 0,
            "radius": 10,
            "enabled": false,
            "blurType": "Gaussian"
          },
          "fills": [],
          "borders": [],
          "shadows": [],
          "innerShadows": []
        },
        "text": "textInsideArtboard",
        "alignment": "left",
        "lineSpacing": "constantBaseline",
        "fixedWidth": false
      }]
    }],
    "flowStartPoint": false
  }, {
    "type": "Artboard",
    "id": "A93F290F-E8FE-40E9-86E3-BFD063F3D817",
    "frame": {
      "x": -15,
      "y": -100,
      "width": 702,
      "height": 543
    },
    "name": "Artboard 2",
    "selected": false,
    "layers": [{
      "type": "Shape",
      "id": "E6149091-C037-4E46-BD6F-C626F37E8DAD",
      "frame": {
        "x": 160,
        "y": 53,
        "width": 209,
        "height": 165
      },
      "name": "elementInArtboard1",
      "selected": false,
      "flow": null,
      "hidden": false,
      "locked": false,
      "style": {
        "type": "Style",
        "id": "2CB5E1A1-5C37-4A8D-A438-88AADBB838EE",
        "opacity": 1,
        "blendingMode": "Normal",
        "borderOptions": {
          "startArrowhead": "None",
          "endArrowhead": "None",
          "dashPattern": [],
          "lineEnd": "Butt",
          "lineJoin": "Miter"
        },
        "blur": {
          "center": {
            "x": 0.5,
            "y": 0.5
          },
          "motionAngle": 0,
          "radius": 10,
          "enabled": false,
          "blurType": "Gaussian"
        },
        "fills": [{
          "fill": "Color",
          "color": "#d8d8d8ff",
          "gradient": {
            "gradientType": "Linear",
            "from": {
              "x": 0.5,
              "y": 0
            },
            "to": {
              "x": 0.5,
              "y": 1
            },
            "stops": [{
              "position": 0,
              "color": "#ffffffff"
            }, {
              "position": 1,
              "color": "#000000ff"
            }]
          },
          "enabled": true
        }],
        "borders": [],
        "shadows": [],
        "innerShadows": []
      }
    }],
    "flowStartPoint": false
  }, {
    "type": "Shape",
    "id": "11C58051-F247-4589-AF04-73AD21D0C19E",
    "frame": {
      "x": 767,
      "y": -1,
      "width": 209,
      "height": 165
    },
    "name": "layerOutsideArtboard1",
    "selected": false,
    "flow": null,
    "hidden": false,
    "locked": false,
    "style": {
      "type": "Style",
      "id": "3706DFA9-0D4D-4721-AC38-AF411B11BC55",
      "opacity": 1,
      "blendingMode": "Normal",
      "borderOptions": {
        "startArrowhead": "None",
        "endArrowhead": "None",
        "dashPattern": [],
        "lineEnd": "Butt",
        "lineJoin": "Miter"
      },
      "blur": {
        "center": {
          "x": 0.5,
          "y": 0.5
        },
        "motionAngle": 0,
        "radius": 10,
        "enabled": false,
        "blurType": "Gaussian"
      },
      "fills": [{
        "fill": "Color",
        "color": "#d8d8d8ff",
        "gradient": {
          "gradientType": "Linear",
          "from": {
            "x": 0.5,
            "y": 0
          },
          "to": {
            "x": 0.5,
            "y": 1
          },
          "stops": [{
            "position": 0,
            "color": "#ffffffff"
          }, {
            "position": 1,
            "color": "#000000ff"
          }]
        },
        "enabled": true
      }],
      "borders": [],
      "shadows": [],
      "innerShadows": []
    }
  }, {
    "type": "Shape",
    "id": "6AED8B2B-E259-406F-8A60-43882E94B266",
    "frame": {
      "x": 753,
      "y": 253,
      "width": 209,
      "height": 165
    },
    "name": "layerOutsideArtboard2",
    "selected": false,
    "flow": null,
    "hidden": false,
    "locked": false,
    "style": {
      "type": "Style",
      "id": "26D8771D-8D25-4B7E-B037-4851F2E30134",
      "opacity": 1,
      "blendingMode": "Normal",
      "borderOptions": {
        "startArrowhead": "None",
        "endArrowhead": "None",
        "dashPattern": [],
        "lineEnd": "Butt",
        "lineJoin": "Miter"
      },
      "blur": {
        "center": {
          "x": 0.5,
          "y": 0.5
        },
        "motionAngle": 0,
        "radius": 10,
        "enabled": false,
        "blurType": "Gaussian"
      },
      "fills": [{
        "fill": "Color",
        "color": "#d8d8d8ff",
        "gradient": {
          "gradientType": "Linear",
          "from": {
            "x": 0.5,
            "y": 0
          },
          "to": {
            "x": 0.5,
            "y": 1
          },
          "stops": [{
            "position": 0,
            "color": "#ffffffff"
          }, {
            "position": 1,
            "color": "#000000ff"
          }]
        },
        "enabled": true
      }],
      "borders": [],
      "shadows": [],
      "innerShadows": []
    }
  }]
};
