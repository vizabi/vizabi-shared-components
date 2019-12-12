import * as utils from "../../legacy/base/utils";
import * as iconset from "../../icons/iconset"
import { BaseComponent } from "../base-component";
import "./buttonlist.scss";

/*!
 * VIZABI BUTTONLIST
 * Reusable buttonlist component
 */

//default existing buttons
const class_active = "vzb-active";
const class_hidden = "vzb-hidden";
const class_active_locked = "vzb-active-locked";
const class_hide_btn = "vzb-dialog-side-btn";
const class_unavailable = "vzb-unavailable";
const class_vzb_fullscreen = "vzb-force-fullscreen";
const class_container_fullscreen = "vzb-container-fullscreen";

export class ButtonList extends BaseComponent {

  constructor(config) {

    super(config)
  } 

  setup() {

    this._available_buttons = {
      "find": {
        title: "buttons/find",
        icon: "search",
        required: false
      },
      "show": {
        title: "buttons/show",
        icon: "asterisk",
        required: false
      },
      "moreoptions": {
        title: "buttons/more_options",
        icon: "gear",
        required: true
      },
      "colors": {
        title: "buttons/colors",
        icon: "paintbrush",
        required: false
      },
      "mapcolors": {
        title: "buttons/mapcolors",
        icon: "paintbrush",
        required: false
      },
      "size": {
        title: "buttons/size",
        icon: "circle",
        required: false
      },
      "zoom": {
        title: "buttons/zoom",
        icon: "cursorPlus",
        required: false
      },
      "fullscreen": {
        title: "buttons/expand",
        icon: "expand",
        func: this.toggleFullScreen.bind(this),
        required: true
      },
      "trails": {
        title: "buttons/trails",
        icon: "trails",
        func: this.toggleBubbleTrails.bind(this),
        required: false,
        statebind: "root.ui.chart.trails",
        statebindfunc: this.setBubbleTrails.bind(this)
      },
      "forecast": {
        title: "buttons/forecast",
        icon: "forecast",
        func: this.toggleTimeForecast.bind(this),
        required: false,
        statebind: "MDL.frame.showForecast",
        statebindfunc: this.setTimeForecast.bind(this)
      },
      "lock": {
        title: "buttons/lock",
        icon: "lock",
        func: this.toggleBubbleLock.bind(this),
        required: false,
        statebind: "root.ui.chart.lockNonSelected",
        statebindfunc: this.setBubbleLock.bind(this)
      },
      "inpercent": {
        title: "buttons/inpercent",
        icon: "percent",
        func: this.toggleInpercent.bind(this),
        required: false,
        statebind: "root.ui.chart.inpercent",
        statebindfunc: this.setInpercent.bind(this)
      },
      "presentation": {
        title: "buttons/presentation",
        icon: "presentation",
        func: this.togglePresentationMode.bind(this),
        required: false,
        statebind: "root.ui.presentation",
        statebindfunc: this.setPresentationMode.bind(this)
      },
      "sidebarcollapse": {
        title: "buttons/sidebar_collapse",
        icon: "angleDoubleLeft",
        func: this.toggleSidebarCollapse.bind(this),
        required: true,
        statebind: "root.ui.sidebarCollapse",
        statebindfunc: this.setSidebarCollapse.bind(this),
        ignoreSize: true
      },
      "about": {
        title: "buttons/about",
        icon: "about",
        required: false
      },
      "axes": {
        title: "buttons/axes",
        icon: "axes",
        required: false
      },
      "axesmc": {
        title: "buttons/axesmc",
        icon: "axes",
        required: false
      },
      "stack": {
        title: "buttons/stack",
        icon: "stack",
        required: false
      },
      "side": {
        title: "buttons/side",
        icon: "side",
        required: false
      },
      "_default": {
        title: "Button",
        icon: "asterisk",
        required: false
      }
    };

    this._active_comp = false;

    // this.model_binds = {
    //   "change:state.marker.select": function(evt, path) {
    //     if (!_this._readyOnce) return;
    //     if (path.indexOf("select.labelOffset") !== -1) return;

    //     _this.setBubbleTrails();
    //     _this.setBubbleLock();
    //     _this._toggleButtons();


    //     //scroll button list to end if bottons appeared or disappeared
    //     // if(_this.entitiesSelected_1 !== (_this.model.state.marker.select.length > 0)) {
    //     //   _this.scrollToEnd();
    //     // }
    //     // _this.entitiesSelected_1 = _this.model.state.marker.select.length > 0;
    //   },
    //   "change:ui.chart": function(evt, path) {
    //     if (!_this._readyOnce) return;

    //     if (path.indexOf("lockActive") > -1 || path.indexOf("lockUnavailable") > -1) {
    //       _this.setBubbleLock();
    //     }
    //   }
    // };

    // config.ui is same as this.model.ui here but this.model.ui is not yet available because constructor hasn't been called.
    // can't call constructor earlier because this.model_binds needs to be complete before calling constructor
    // builds model
    //this._super(config, context);

    this.validatePopupButtons(this.root.ui.buttons.buttons, this.root.ui.dialogs);

    this.element.selectAll("div").remove();

    // // // // this.root.findChildByName("gapminder-dialogs").on("close", (evt, params) => {
    // // // //   _this.setButtonActive(params.id, false);
    // // // // });


    // // if button_expand has been passed in with boolean param or array must check and covert to array
    // if (button_expand){
    //   this.model.ui.dialogs.sidebar = (button_expand === true) ? this.model.ui.buttons : button_expand;
    // }

    // if (button_expand && button_expand.length !== 0) {
    //     d3.select(this.root.element).classed("vzb-dialog-expand-true", true);
    // }


    // (button_expand||[]).forEach(function(button) {
    //   if (button_list.indexOf(button) === -1) {
    //     button_list.push(button);
    //   }
    // });

    //this.model.ui.buttons = button_list;

    //add buttons and render components

    //store body overflow
    this._prev_body_overflow = document.body.style.overflow;

    // this.setBubbleTrails();
    // this.setTimeForecast();
    // this.setBubbleLock();
    // this.setInpercent();
    // this.setPresentationMode();


  }

  draw() {
    this.localise = this.services.locale.auto();

    this.MDL = {
      frame: this.model.encoding.get("frame")
    }

    const button_expand = (this.root.ui.dialogs || {}).sidebar || [];
    const button_list = [].concat(this.ui.buttons);
    this._addButtons(button_list, button_expand);
    this._toggleButtons();

    this.ui.buttons.forEach(buttonId => {
      const button = this._available_buttons[buttonId];
      if (button && button.statebind) {
        this.addReaction(() => {
          //_this.model_binds["change:" + button.statebind] = function(evt) {
          //if (!_this._readyOnce) return;
          button.statebindfunc(buttonId, utils.getProp(this, button.statebind.split(".")));
        });
      }
    });

  }

  proceedClick(id) {
    const _this = this;
    const btn = _this.element.selectAll(".vzb-buttonlist-btn[data-btn='" + id + "']");
    const classes = btn.attr("class");
    const btn_config = _this._available_buttons[id];

    if (btn_config && btn_config.func) {
      btn_config.func(id);
    } else {
      const btn_active = classes.indexOf(class_active) === -1;

      btn.classed(class_active, btn_active);
      const evt = {};
      evt["id"] = id;
      evt["active"] = btn_active;
      _this.trigger("click", evt);
    }
  }

  validatePopupButtons(buttons, dialogs) {
    const _this = this;

    const popupDialogs = dialogs.popup;
    const popupButtons = buttons.filter(d => (_this._available_buttons[d] && !_this._available_buttons[d].func));
    for (let i = 0, j = popupButtons.length; i < j; i++) {
      if (popupDialogs.indexOf(popupButtons[i]) == -1) {
        return utils.error('Buttonlist: bad buttons config: "' + popupButtons[i] + '" is missing in popups list');
      }
    }
    return false; //all good
  }

  /*
   * reset buttons show state
   */
  _showAllButtons() {
    // show all existing buttons
    const _this = this;
    const buttons = this.element.selectAll(".vzb-buttonlist-btn");
    buttons.each(function(d, i) {
      const button = d3.select(this);
      button.style("display", "");
    });
  }

  /*
  * determine which buttons are shown on the buttonlist
  */
  _toggleButtons() {
    const _this = this;
    const parent = this.parent.element.node ? this.parent.element : d3.select(this.parent.element);

    //HERE
    const button_expand = (this.ui.dialogs || {}).sidebar || [];
    _this._showAllButtons();

    const buttons = this.element.selectAll(".vzb-buttonlist-btn");

    const container = this.element.node().getBoundingClientRect();

    const not_required = [];
    const required = [];

    let button_width = 80;
    let button_height = 80;
    let container_width = this.element.node().getBoundingClientRect().width;
    let container_height = this.element.node().getBoundingClientRect().height;
    let buttons_width = 0;
    let buttons_height = 0;

    buttons.filter(d => !d.ignoreSize).each(function(d, i) {
      const button_data = d;
      const button = d3.select(this);
      const expandable = button_expand.indexOf(button_data.id) !== -1;
      const button_margin = { top: parseInt(button.style("margin-top")), right: parseInt(button.style("margin-right")), left: parseInt(button.style("margin-left")), bottom: parseInt(button.style("margin-bottom")) };
      button_width = button.node().getBoundingClientRect().width + button_margin.right + button_margin.left;
      button_height = button.node().getBoundingClientRect().height + button_margin.top + button_margin.bottom;

      if (!button.classed(class_hidden)) {
        if (!expandable || _this.getLayoutProfile() !== "large" || _this.model.ui.sidebarCollapse) {
          buttons_width += button_width;
          buttons_height += button_height;
          //sort buttons between required and not required buttons.
          // Not required buttons will only be shown if there is space available
          if (button_data.required) {
            required.push(button);
          } else {
            not_required.push(button);
          }
        } else {
          button.style("display", "none");
        }
      }
    });
    const width_diff = buttons_width - container_width;
    const height_diff = buttons_height - container_height;
    let number_of_buttons = 1;

    //check if container is landscape or portrait
    // if portrait small or large with expand, use width
    if (parent.classed("vzb-large") && parent.classed("vzb-dialog-expand-true")
    || parent.classed("vzb-small") && parent.classed("vzb-portrait")) {
      //check if the width_diff is small. If it is, add to the container
      // width, to allow more buttons in a way that is still usable
      if (width_diff > 0 && width_diff <= 10) {
        container_width += width_diff;
      }
      number_of_buttons = Math.floor(container_width / button_width) - required.length;
      if (number_of_buttons < 0) {
        number_of_buttons = 0;
      }
    // else, use height
    } else {
      //check if the width_diff is small. If it is, add to the container
      // width, to allow more buttons in a way that is still usable
      if (height_diff > 0 && height_diff <= 10) {
        container_height += height_diff;
      }
      number_of_buttons = Math.floor(container_height / button_height) - required.length;
      if (number_of_buttons < 0) {
        number_of_buttons = 0;
      }
    }
    //change the display property of non required buttons, from right to
    // left
    not_required.reverse();
    const hiddenButtons = [];
    for (let i = 0, j = not_required.length - number_of_buttons; i < j; i++) {
      not_required[i].style("display", "none");
      hiddenButtons.push(not_required[i].attr("data-btn"));
    }

    // const evt = {};
    // evt["hiddenButtons"] = hiddenButtons;
    // _this.trigger("toggle", evt);

  }

  /*
   * adds buttons configuration to the components and template_data
   * @param {Array} button_list list of buttons to be added
   */
  _addButtons(button_list, button_expand) {
    const _this = this;
    this._components_config = [];
    const details_btns = [];
    if (!button_list.length) return;
    //add a component for each button
    for (let i = 0; i < button_list.length; i++) {

      const btn = button_list[i];
      const btn_config = this._available_buttons[btn];

      //add template data
      const d = (btn_config) ? btn : "_default";
      const details_btn = utils.clone(this._available_buttons[d]);
      if (d == "_default") {
        details_btn.title = "buttons/" + btn;
      }
      details_btn.id = btn;
      details_btn.icon = iconset["ICON_" + details_btn.icon.toUpperCase()];
      details_btns.push(details_btn);
    }

    const t = this.localise;

    this.element.selectAll("button").data(details_btns)
      .enter().append("button")
      .attr("class", d => {
        let cls = "vzb-buttonlist-btn";
        if (button_expand.length > 0) {
          if (button_expand.indexOf(d.id) > -1) {
            cls += " vzb-dialog-side-btn";
          }
        }

        return cls;
      })
      .attr("data-btn", d => d.id)
      .html(btn => "<span class='vzb-buttonlist-btn-icon fa'>" +
          btn.icon + "</span><span class='vzb-buttonlist-btn-title'>" +
          t(btn.title) + "</span>");

    const buttons = this.element.selectAll(".vzb-buttonlist-btn");

    //clicking the button
    buttons.on("click", function() {

      d3.event.preventDefault();
      d3.event.stopPropagation();

      const id = d3.select(this).attr("data-btn");
      _this.proceedClick(id);
    });

  }


  scrollToEnd() {
    let target = 0;
    const parent = d3.select(".vzb-tool");

    if (parent.classed("vzb-portrait") && parent.classed("vzb-small")) {
      if (this.model.state.marker.select.length > 0) target = this.element.node().scrollWidth;
      this.element.node().scrollLeft = target;
    } else {
      if (this.model.state.marker.select.length > 0) target = this.element.node().scrollHeight;
      this.element.node().scrollTop = target;
    }
  }


  /*
   * RESIZE:
   * Executed whenever the container is resized
   * Ideally, it contains only operations related to size
   */
  resize() {
    //TODO: what to do when resizing?
    if (!this.element.selectAll) return utils.warn("buttonlist resize() aborted because element is not yet defined");

    //toggle presentaion off is switch to 'small' profile
    if (this.services.layout.profile === "SMALL" && this.services.layout.projector) {
      this.togglePresentationMode();
    }

    this._toggleButtons();
  }

  setButtonActive(id, boolActive) {
    const btn = this.element.selectAll(".vzb-buttonlist-btn[data-btn='" + id + "']");

    btn.classed(class_active, boolActive);
  }

  toggleSidebarCollapse() {
    this.ui.sidebarCollapse = !this.ui.sidebarCollapse;
    this.setSidebarCollapse();
  }

  setSidebarCollapse() {
    const rootEl = this.root.element;
    if (rootEl.classed("vzb-dialog-expand-true") == this.ui.sidebarCollapse) {
      rootEl.classed("vzb-dialog-expand-true", !this.ui.sidebarCollapse);
      this.services.layout._resizeHandler();
      //this.root.trigger("resize");
    }
  }

  toggleBubbleTrails() {
    this.model.ui.chart.trails = !this.model.ui.chart.trails;
    this.setBubbleTrails();
  }
  setBubbleTrails() {
    const trails = (this.model.ui.chart || {}).trails;
    if (!trails && trails !== false) return;
    const id = "trails";
    const btn = this.element.selectAll(".vzb-buttonlist-btn[data-btn='" + id + "']");
    if (!btn.node()) return utils.warn("setBubbleTrails: no button '" + id + "' found in DOM. doing nothing");

    btn.classed(class_active_locked, trails);
    btn.classed(class_hidden, this.model.state.marker.select.length == 0);
  }
  toggleTimeForecast() {
    this.model.state.time.showForecast = !this.model.state.time.showForecast;
    this.setTimeForecast();
  }
  setTimeForecast() {
    const showForecast = (this.model.state.time || {}).showForecast;
    if (!showForecast && showForecast !== false) return;
    const id = "forecast";
    const btn = this.element.selectAll(".vzb-buttonlist-btn[data-btn='" + id + "']");
    if (!btn.node()) return utils.warn("setBubbleTrails: no button '" + id + "' found in DOM. doing nothing");

    btn.classed(class_active_locked, showForecast);
    btn.classed(class_hidden, !this.model.state.time.endBeforeForecast);
  }
  toggleBubbleLock(id) {
    const active = (this.model.ui.chart || {}).lockActive;

    if (this.model.state.marker.select.length == 0 && !active) return;

    let locked = this.model.ui.chart.lockNonSelected;
    const time = this.model.state.time;
    locked = locked ? 0 : time.formatDate(time.value);
    this.model.ui.chart.lockNonSelected = locked;

    this.setBubbleLock();
  }
  setBubbleLock() {
    let locked = (this.model.ui.chart || {}).lockNonSelected;
    const active = (this.model.ui.chart || {}).lockActive;
    const unavailable = (this.model.ui.chart || {}).lockUnavailable || false;
    if (!locked && locked !== 0) return;

    if (locked !== 0 && this.model.state.marker.select.length === 0 && !active) {
      locked = this.model.ui.chart.lockNonSelected = 0;
    }

    const id = "lock";
    const btn = this.element.selectAll(".vzb-buttonlist-btn[data-btn='" + id + "']");
    if (!btn.node()) return utils.warn("setBubbleLock: no button '" + id + "' found in DOM. doing nothing");

    //btn.classed(class_unavailable, this.model.state.marker.select.length == 0 && !active);
    btn.classed(class_unavailable, unavailable);
    if (typeof active === "undefined") {
      btn.classed(class_hidden, this.model.state.marker.select.length == 0);
    } else {
      btn.classed(class_hidden, !active);
    }

    btn.classed(class_active_locked, locked);

    btn.select(".vzb-buttonlist-btn-icon")
      .html(iconset[locked ? "ICON_LOCK" : "ICON_UNLOCK"]);

    btn.select(".vzb-buttonlist-btn-title>span").text(
      locked ? locked : this.localise("buttons/lock")
    )
      .attr("data-vzb-translate", locked ? null : "buttons/lock");
  }
  toggleInpercent() {
    this.model.ui.chart.inpercent = !this.model.ui.chart.inpercent;
    this.setInpercent();
  }
  setInpercent() {
    if (typeof ((this.model.ui.chart || {}).inpercent) === "undefined") return;
    const id = "inpercent";
    const btn = this.element.selectAll(".vzb-buttonlist-btn[data-btn='" + id + "']");

    btn.classed(class_active_locked, this.model.ui.chart.inpercent);
  }
  togglePresentationMode() {
    this.services.layout.setProjector(!this.services.layout.projector);
    this.setPresentationMode();
  }
  setPresentationMode() {
    const id = "presentation";
    const btn = this.element.selectAll(".vzb-buttonlist-btn[data-btn='" + id + "']");

    btn.classed(class_active_locked, this.services.layout.projector);
  }
  toggleFullScreen(id, emulateClick) {

    if (!window) return;

    let component = this;
    //let pholder = component.placeholder;
    let pholder = component.root.element.node();
    let pholder_found = false;
    const btn = this.element.selectAll(".vzb-buttonlist-btn[data-btn='" + id + "']");
    const fs = !this.ui.fullscreen;
    const body_overflow = (fs) ? "hidden" : this._prev_body_overflow;

    // while (!(pholder_found = utils.hasClass(pholder, "vzb-placeholder"))) {
    //   component = component.parent;
    //   pholder = component.placeholder;
    // }

    //TODO: figure out a way to avoid fullscreen resize delay in firefox
    if (fs) {
      this.resizeInExitHandler = false;
      launchIntoFullscreen(pholder);
      subscribeFullscreenChangeEvent.call(this, this.toggleFullScreen.bind(this, id, true));
    } else {
      this.resizeInExitHandler = !emulateClick;
      exitFullscreen.call(this);
    }
    //utils.classed(pholder, class_vzb_fullscreen, fs);
    if (typeof container !== "undefined") {
      //utils.classed(container, class_container_fullscreen, fs);
    }

    this.ui.fullscreen = fs;
    btn.classed(class_active_locked, fs);

    btn.select(".vzb-buttonlist-btn-icon").html(iconset[fs ? "ICON_UNEXPAND" : "ICON_EXPAND"]);

    btn.select(".vzb-buttonlist-btn-title").text(
      this.localise("buttons/" + (fs ? "unexpand" : "expand"))
    )
      .attr("data-vzb-translate", "buttons/" + (fs ? "unexpand" : "expand"));

    //restore body overflow
    document.body.style.overflow = body_overflow;

    if (!this.resizeInExitHandler) this.services.layout._resizeHandler();

    //force window resize event
    // utils.defer(function() {
    //   event = window.document.createEvent("HTMLEvents");
    //   event.initEvent("resize", true, true);
    //   event.eventName = "resize";
    //   window.dispatchEvent(event);
    // });
  }

}

ButtonList.DEFAULT_UI = {
  buttons: ["fullscreen"],
  sidebarCollapse: false
}

function isFullscreen() {
  if (!window) return false;
  if (window.document.webkitIsFullScreen !== undefined)
    return window.document.webkitIsFullScreen;
  if (window.document.mozFullScreen !== undefined)
    return window.document.mozFullScreen;
  if (window.document.msFullscreenElement !== undefined)
    return window.document.msFullscreenElement;

  return false;
}

function exitHandler(emulateClickFunc) {
  if (!isFullscreen()) {
    removeFullscreenChangeEvent.call(this);
    if (!this.resizeInExitHandler) {
      emulateClickFunc();
    } else {
      this.services.layout._resizeHandler();
    }
  }
}

function subscribeFullscreenChangeEvent(exitFunc) {
  if (!window) return;
  const doc = window.document;

  this.exitFullscreenHandler = exitHandler.bind(this, exitFunc);
  doc.addEventListener("webkitfullscreenchange", this.exitFullscreenHandler, false);
  doc.addEventListener("mozfullscreenchange", this.exitFullscreenHandler, false);
  doc.addEventListener("fullscreenchange", this.exitFullscreenHandler, false);
  doc.addEventListener("MSFullscreenChange", this.exitFullscreenHandler, false);
}

function removeFullscreenChangeEvent() {
  const doc = window.document;

  doc.removeEventListener("webkitfullscreenchange", this.exitFullscreenHandler);
  doc.removeEventListener("mozfullscreenchange", this.exitFullscreenHandler);
  doc.removeEventListener("fullscreenchange", this.exitFullscreenHandler);
  doc.removeEventListener("MSFullscreenChange", this.exitFullscreenHandler);
}

function launchIntoFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen && allowWebkitFullscreenAPI()) {
    elem.webkitRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen && allowWebkitFullscreenAPI()) {
    document.webkitExitFullscreen();
  } else {
    removeFullscreenChangeEvent.call(this);
    this.resizeInExitHandler = false;
  }
}

function allowWebkitFullscreenAPI() {
  return !(navigator.vendor && navigator.vendor.indexOf("Apple") > -1 &&
    navigator.userAgent && !navigator.userAgent.match("CriOS"));
}
