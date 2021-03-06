import { Dialog } from "../dialog";
import { ZoomButtonList } from "../../zoombuttonlist/zoombuttonlist";
import { SimpleCheckbox } from "../../simplecheckbox/simplecheckbox";

/*
 * Zoom dialog
 */

export class Zoom extends Dialog {
  constructor(config) {
    config.template = `
      <div class='vzb-dialog-modal'>
        <span class="thumb-tack-class thumb-tack-class-ico-pin fa" data-dialogtype="label" data-click="pinDialog"></span>
        <span class="thumb-tack-class thumb-tack-class-ico-drag fa" data-dialogtype="label" data-click="dragDialog"></span>
        <div class="vzb-dialog-title"> 
          <span></span>
          <div class="vzb-dialog-zoom-buttonlist"></div>
        </div>
            
            
        <div class="vzb-dialog-content">
          <div class="vzb-panwitharrow-switch"></div>
          <div class="vzb-zoomonscrolling-switch"></div>
          <div class="vzb-adaptminmaxzoom-switch"></div>
        </div>
      
        <div class="vzb-dialog-buttons">
          <div data-click="closeDialog" class="vzb-dialog-button vzb-label-primary">
            <span><span/>
          </div>
        </div>
      
      </div>    
    `;

    config.subcomponents = [{
      type: ZoomButtonList,
      placeholder: ".vzb-dialog-zoom-buttonlist"
    },{
      type: SimpleCheckbox,
      placeholder: ".vzb-panwitharrow-switch",
      options: {
        checkbox: "panWithArrow",
        submodel: "root.ui.chart"
      }
    },{
      type: SimpleCheckbox,
      placeholder: ".vzb-zoomonscrolling-switch",
      options: {
        checkbox: "zoomOnScrolling",
        submodel: "root.ui.chart"
      }
    },{
      type: SimpleCheckbox,
      placeholder: ".vzb-adaptminmaxzoom-switch",
      options: {
        checkbox: "adaptMinMaxZoom",
        submodel: "root.ui.chart"
      }
    }];

    super(config);
  }

  draw() {
    super.draw();

    this.DOM.title.select("span").text(this.localise("buttons/zoom"));
    this.DOM.buttons.select("span").text(this.localise("buttons/ok"));
  }
}

Dialog.add("zoom", Zoom);
