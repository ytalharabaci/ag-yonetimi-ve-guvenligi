import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				banner: z.object({
					content: z.string(),
				}).optional().default({
					content: '🚀 Bu rehber açık kaynaklıdır ve katkılarınıza açıktır! Katkıda bulunmak, hata bildirmek veya öneri sunmak için <a href="https://github.com/yusufarbc/ag-yonetimi-ve-guvenligi">GitHub Depomuzu</a> ziyaret edin ve Pull Request açın.'
				})
			})
		})
	}),
};

