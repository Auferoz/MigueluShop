import { db, Role, User, Product, ProductImage } from 'astro:db';
import { v4 as UUID } from 'uuid';
import bcrypt from 'bcryptjs'
import { seedProducts } from './seed-data';

// https://astro.build/db/seed
export default async function seed() {
	
	const roles = [
		{ id: 'owner', name: 'Creador' },
		{ id: 'admin', name: 'Administrador' },
		{ id: 'user', name: 'Usuario' },
		{ id: 'client', name: 'Cliente' },
	];

	const Auferoz = {
		id: UUID(),
		name: 'Alfredo Saavedra',
		email: 'auferoz@gmail.com',
		password: bcrypt.hashSync('123456'),
		role: 'admin'
	};

	const Alfredo = {
		id: UUID(),
		name: 'Alfredo Javier',
		email: 'alfredo@gmail.com',
		password: bcrypt.hashSync('123456'),
		role: 'user'
	};

	await db.insert(Role).values(roles);
	await db.insert(User).values([Auferoz, Alfredo]);

	const queries: any = [];

	seedProducts.forEach((p) => {
		const product = {
			id: UUID(),
			description: p.description,
			gender: p.gender,
			price: p.price,
			sizes: p.sizes.join(','),
			slug: p.slug,
			stock: p.stock,
			tags: p.tags.join(','),
			title: p.title,
			type: p.type,
			user: Auferoz.id,
		};

		queries.push(db.insert(Product).values(product));

		p.images.forEach((img) => {
			const image = {
				id: UUID(),
				image: img,
				productId: product.id,
			};

			queries.push(db.insert(ProductImage).values(image));
		});
	});

	await db.batch(queries);

}
