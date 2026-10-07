import { Component, inject, signal } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { MenuitemService } from '../../services/menuItem.service';
import { first } from 'rxjs';

@Component({
  imports: [],
  selector: 'app-menu',
  styleUrl: './menu.scss',
  templateUrl: './menu.html',
})
export class Menu {

//Signal error
  error = signal<string | null>(null);

//Signal till vald kategori 
selectedCategory = signal<number | null>(null);

//Läser in services
categoryService = inject(CategoryService);
menuItemService = inject(MenuitemService);

//Vid start
async ngOnInit() {

  try {

  //Laddar kategorier
  await this.categoryService.loadCategories();

  //Hämtar kategorier 
  const categoryList = this.categoryService.categories();

  //Kontroll om listan innehåller några kategorier
  if(categoryList.length > 0) {
    //Hämtar det första kategori id:et ur listan
    const firstIndex = categoryList[0].category_id;

    //Ändrar till första index och laddar menyartiklarna som tillhör kategorin.
    this.selectedCategory.set(firstIndex);
    this.menuItemService.loadMenuCategory(firstIndex);

  }

  } catch(error) {
    this.error.set("Menyerna kunde inte laddas. Försök igen senare.");
  }

}

//Ändra kategori med tillhörande meynartiklar.
changeCategory(id: number) {
  this.selectedCategory.set(id);
  this.menuItemService.loadMenuCategory(id);
}


}
