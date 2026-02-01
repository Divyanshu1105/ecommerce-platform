from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from products.models import Product
from decimal import Decimal
import uuid


class ProductJSONStructureTest(APITestCase):

    def setUp(self):
        Product.objects.create(
            id=uuid.uuid4(),
            name="Test Lamp",
            image="images/products/test-lamp.jpg",
            rating_stars=Decimal("4.5"),
            rating_count=10,
            price_cents=2300,
            keywords=["home", "lighting"]
        )

    def test_products_json_structure(self):
        url = reverse("product-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        self.assertGreater(len(data), 0)

        product = data[0]

        required_fields = [
            "id",
            "image",
            "name",
            "rating",
            "priceCents",
            "keywords",
        ]

        for field in required_fields:
            self.assertIn(field, product)

        rating = product["rating"]
        self.assertIn("stars", rating)
        self.assertIn("count", rating)
        self.assertIsInstance(product["priceCents"], int)
        self.assertIsInstance(product["rating"]["stars"], float)
        self.assertIsInstance(product["rating"]["count"], int)

