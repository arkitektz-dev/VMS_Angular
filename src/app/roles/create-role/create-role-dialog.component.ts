import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
} from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalRef } from "ngx-bootstrap/modal";
import { AppComponentBase } from "@shared/app-component-base";
import {
  RoleServiceProxy,
  RoleDto,
  PermissionDto,
  PermissionActionDto,
  CreateRoleDto,
  PermissionDtoListResultDto,
} from "@shared/service-proxies/service-proxies";
import { forEach as _forEach, map as _map } from "lodash-es";

@Component({
  templateUrl: "create-role-dialog.component.html",
})
export class CreateRoleDialogComponent
  extends AppComponentBase
  implements OnInit {
  saving = false;
  role = new RoleDto();
  permissions: PermissionDto[] = [];
  checkedPermissionsMap: { [key: string]: boolean } = {};
  checkedActionsMap: any = [];
  defaultPermissionCheckedStatus = true;

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _roleService: RoleServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._roleService
      .getAllPermissions()
      .subscribe((result: PermissionDtoListResultDto) => {
        console.log(result.items);
        this.permissions = result.items;
        this.setInitialPermissionsStatus();
      });
  }

  setInitialPermissionsStatus(): void {
    _map(this.permissions, (item) => {
      this.checkedPermissionsMap[item.name] = this.isPermissionChecked(
        item.name
      );
    });
    _map(this.permissions, (item) => {
      this.checkedActionsMap.push({
        permissionName: item.name,
        actions: [],
      });
    });
  }

  isPermissionChecked(permissionName: string): boolean {
    // just return default permission checked status
    // it's better to use a setting
    return this.defaultPermissionCheckedStatus;
  }

  onPermissionChange(permission: PermissionDto, $event) {
    this.checkedPermissionsMap[permission.name] = $event.target.checked;
    if (!$event.target.checked) {
      const premissionAction = this.checkedActionsMap.find(
        (a) => a.permissionName === permission.name
      );
      premissionAction.actions = [];
    }
  }

  onActionChange(action, permissionName, $event) {
    const permission = this.checkedActionsMap.find(
      (a) => a.permissionName === permissionName
    );
    if (!permission) {
      var obj = {
        permissionName,
        actions: [action],
      };
      this.checkedActionsMap.push(obj);
    } else {
      const index = permission.actions.indexOf(action);
      if (index === -1) {
        permission.actions.push(action);
      } else {
        permission.actions.splice(index, 1);
      }
    }
    console.log(this.getCheckedPermissions());

    console.log(this.checkedActionsMap);
  }

  getCheckedPermissions(): string[] {
    const permissions: string[] = [];
    _forEach(this.checkedPermissionsMap, function (value, key) {
      if (value) {
        permissions.push(key);
      }
    });
    return permissions;
  }

  save(): void {
    this.saving = true;

    const role = new CreateRoleDto();
    role.init(this.role);
    role.grantedPermissions = this.getCheckedPermissions();
    role.actions = this.checkedActionsMap.map((c) => {
      var permissionDto = new PermissionActionDto();
      permissionDto.permissionName = c.permissionName;
      permissionDto.actions = c.actions;
      return permissionDto;
    });
    console.log(role);

    this._roleService
      .create(role)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.bsModalRef.hide();
        this.onSave.emit();
      });
  }
}
