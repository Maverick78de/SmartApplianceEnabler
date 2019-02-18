import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Control} from '../control/control';
import {Switch} from '../control/switch';
import {ErrorMessages} from '../shared/error-messages';
import {ErrorMessageHandler} from '../shared/error-message-handler';
import {ControlService} from '../control/control-service';
import {TranslateService} from '@ngx-translate/core';
import {ControlDefaults} from '../control/control-defaults';
import {ControlSwitchErrorMessages} from './control-switch-error-messages';
import {InputValidatorPatterns} from '../shared/input-validator-patterns';
import {Logger} from '../log/logger';

@Component({
  selector: 'app-control-switch',
  templateUrl: './control-switch.component.html',
  styles: []
})
export class ControlSwitchComponent implements OnInit {
  @Input()
  control: Control;
  @Input()
  applianceId: string;
  @Input()
  controlDefaults: ControlDefaults;
  @Output()
  childFormChanged = new EventEmitter<boolean>();
  switchForm: FormGroup;
  errors: { [key: string]: string } = {};
  errorMessages: ErrorMessages;
  errorMessageHandler: ErrorMessageHandler;

  constructor(private logger: Logger,
              private controlService: ControlService,
              private translate: TranslateService
  ) {
    this.errorMessageHandler = new ErrorMessageHandler(logger);
  }

  ngOnInit() {
    this.errorMessages =  new ControlSwitchErrorMessages(this.translate);
    this.switchForm = this.buildSwitchFormGroup(this.control.switch_);
    this.switchForm.statusChanges.subscribe(() => {
      this.childFormChanged.emit(this.switchForm.valid);
      this.errors = this.errorMessageHandler.applyErrorMessages4ReactiveForm(this.switchForm, this.errorMessages);
    });
  }

  buildSwitchFormGroup(switch_: Switch): FormGroup {
    return new FormGroup({
      gpio: new FormControl(switch_ ? switch_.gpio : undefined,
        [Validators.required, Validators.pattern(InputValidatorPatterns.INTEGER)]),
      reverseStates: new FormControl(switch_ ? switch_.reverseStates : undefined)
    });
  }

}
