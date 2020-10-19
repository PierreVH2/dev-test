import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface RestaurantFilter {
  search: string;
  tagList: string[];
  familyFriendly: boolean;
  vegan: boolean;
}

@Component({
  selector: 'app-restaurant-filters',
  templateUrl: './restaurant-filters.component.html',
  styleUrls: ['./restaurant-filters.component.scss'],
})
export class RestaurantFiltersComponent implements OnChanges{
  @Input()
  tags: string[] = [];

  @Output()
  filtersChange = new EventEmitter<RestaurantFilter>();

  private tagMap: {[tagName: string]: boolean} = {};
  public get tagNames(): string[] {
    return Object.keys(this.tagMap);
  }

  public form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      search: [''],
      tags: [[] as string[]],
      familyFriendly: [false],
      vegan: [false],
    });

    this.form.valueChanges.subscribe((newValue) => {
      this.filtersChange.next({
        search: newValue.search || '',
        tagList: newValue.tags || [],
        familyFriendly: !!newValue.familyFriendly,
        vegan: !!newValue.vegan
      } as RestaurantFilter);
    });
  }

  ngOnChanges(): void {
    this.tagMap = this.tags.reduce((accumTagMap, nextTagName) => {
      accumTagMap[nextTagName] = false;
      return accumTagMap;
    }, {} as {[tagName: string]: boolean});
  }

  onTagCheckToggle(tagName: string): void {
    this.tagMap[tagName] = !this.tagMap[tagName];
    const activatedTags = Object.keys(this.tagMap).reduce((accumActive, nextTagName) => {
      if (!!this.tagMap[nextTagName]) {
        accumActive.push(nextTagName);
      }
      return accumActive;
    }, [] as string[]);
    this.form.controls.tags.patchValue(activatedTags);
  }
}
