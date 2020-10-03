import React from 'react'
import {NavLink} from 'react-router-dom'
import main from '../images/main.png'
import demand from '../images/demand.png'

export const HomePage = () => {

	return (
		<div className="content">
			<div className="row">
				<div className="col xl6">
					<div className="main-block-1">
						Подходит для оптовой и розничной торговли, интернет-магазина, производства или строительства —
						для любого бизнеса, где есть товары, сырье или материалы.
						Ощутите наши преимущества! Доступ из любого места, где есть интернет. Работает на Windows, Linux, Android и iOS.
						Покупать программу не нужно — небольшая абонентская плата включает поддержку пользователей.
						Быстрый старт — не нужна установка и внедрение. Пробный период — зарегистрируйтесь и попробуйте прямо сейчас, это бесплатно.
					</div>
					<div>
						<button className="btn btn-outline" id="register-link">Регистрация</button>
					</div>
				</div>
				<div className="col xl6">
					<div className="main-block-1">
						<img src={main} alt=""/>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col xl12">
					<div className="main-block-2">
						<p>Закупки и складской учет</p>
						Все складские операции: приемка и отгрузка товара, перемещения, инвентаризации, списания
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col xl6">
					<div className="main-block-3">
						<img src={demand} alt=""/>
					</div>
				</div>
				<div className="col xl6">
					<div className="main-block-3">
						Собственные и комиссионные товары. Расчет себестоимости. Остатки и обороты.
						Планирование состояния склада и автоматические заказы поставщикам.
						Печать складских документов: М-11, ИНВ-3, ТОРГ-16, МХ-1 и других.
						Поддержка нескольких складов, партии, серийные номера, ГТД, характеристики, упаковки и штрих-коды.
					</div>
				</div>
			</div>
		</div>
	)
}