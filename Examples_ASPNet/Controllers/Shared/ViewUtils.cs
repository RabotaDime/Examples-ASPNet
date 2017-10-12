using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Web;



namespace Examples_ASPNet
{
	public static class MyFileHelper
	{
		///   Текст-подсказка для размера файлов. 
		public static String GetSizeHint (Int64 aSizeValue)
		{
			String[] ValueTypes = new String[] { "Байт", "КБ", "МБ", "ГБ", "ТБ", };

			Int32 E = 1;
			while (aSizeValue > Math.Pow(1024, E))
			{
				E++;
				if (E >= ValueTypes.Length) break;
			}

			if (E == 1)
				return String.Format("{0} {1}", aSizeValue, ValueTypes[E - 1]);
			else
			{
				double V = aSizeValue / Math.Pow(1024, E - 1);
				return String.Format("{0:0.00} {1}", V, ValueTypes[E - 1]);
			}
		}
	}



	public abstract class ViewParam<T>
	{
		public readonly String	ParamID;
		public T				DefaultValue;

		protected T		_ParamValue;
		protected bool	_IsOptional;

		public ViewParam (String aParamID, T aDefaultValue)
		{
			ParamID			= aParamID;
			DefaultValue	= aDefaultValue;
			_ParamValue		= aDefaultValue;
			_IsOptional		= false;
		}

		public virtual T ParamValue
		{
			get { return _ParamValue; }
			set { _ParamValue = value; }
		}

		public virtual void GetFromRequest (HttpRequestBase aR)
		{
		}

		public virtual String MakeStringFor (T aOtherValue)
		{
			return String.Format
			(
				"{0}={1}",
				/* 0 */ this.ParamID,
				/* 1 */ this.GetValueFor(aOtherValue)
			);
		}

		public virtual String		MakeString () { return MakeStringFor(this._ParamValue); }

		public abstract String		GetValueFor (T aOtherValue);
		public virtual String		GetValue () { return GetValueFor(this._ParamValue); }
	}



	public class ViewParams
	{
		protected HttpRequestBase _Request;

		public ViewParams (HttpRequestBase aR)
		{
			_Request = aR;
		}
	}



	///   Классы для проверки входящих параметров созданы потому, что я привык к такой схеме. 
	///   И они прописаны пока на скорую руку, поэтому не все поля закрыты внутри кода. 
	///   Проверку я пропишу только на входящие веб-данные. 
	public class MoneyViewParam : ViewParam<Decimal>
	{
		public Decimal MinimalAllowedValue = Decimal.MinValue;
		public Decimal MaximalAllowedValue = Decimal.MaxValue;

		public MoneyViewParam(String aParamID, Decimal aDefaultValue) : base (aParamID, aDefaultValue)
		{
		}

		public MoneyViewParam
		(
			String aParamID,
			Decimal aDefaultValue,
			Decimal aMin,
			Decimal aMax) : base (aParamID, aDefaultValue)
		{
			MinimalAllowedValue = aMin;
			MaximalAllowedValue = aMax;
		}

		public override Decimal ParamValue
		{
			get
			{
				return _ParamValue;
			}

			set
			{
				if
				(
					(value >= MinimalAllowedValue) &&
					(value <= MaximalAllowedValue)
				)
					_ParamValue = value;
				else
					_ParamValue = this.DefaultValue;
			}
		}

		public override void GetFromRequest (HttpRequestBase aR)
		{
			Object V = aR.Params[this.ParamID];
			String P = ((V != null) && (V is String)) ? (String) V : null;

			///   Выходим в двух случаях: либо в коллекции Params нет такого ключа
			///   (то есть, в страницу не пришел нужный аргумент вообще), либо если 
			///   такой ключ есть, но, по какому-то странному стечению обстоятельств, 
			///   связанное значение по этому ключу равно Null. 
			if (P == null) return;

			///   Считываем Decimal значение из веб-запроса. 
			decimal TempSumVar;

			if (Decimal.TryParse(P, NumberStyles.Number, new CultureInfo("en-US"), out TempSumVar))
			{
				///   Присваиваем значение свойству, а не переменной. 
				///   Вдруг там потребуется какая-то проверка. 
				this.ParamValue = TempSumVar;
			}
		}

		public override String GetValueFor (Decimal aOtherValue)
		{
			return aOtherValue.ToString().Replace(",", ".");
		}
	}
}



namespace Examples_ASPNet.DBPayments
{
	public enum BonusesViewType
	{
		Undefined		= 0,
		ForEmployees	= 10,
		ByDepartments	= 20,
	}

	///   Потом отнаследую этот класс от другого, который будет проверять текстовые значения 
	///   по внутреннему списку, а не каждый раз брать из констант. 
	public class BonusesViewParam : ViewParam<BonusesViewType>
	{
		///   Комментарии справа просто для напоминания. 
		public readonly String ValueTextLiteral_ForEmployees		= "E"; //.ToUpperInvariant();
		public readonly String ValueTextLiteral_ByDepartments		= "D"; //.ToUpperInvariant();

		public BonusesViewParam (String aParamID, BonusesViewType aDefaultValue) : base (aParamID, aDefaultValue)
		{
		}

		public override BonusesViewType ParamValue
		{
			get
			{
				return _ParamValue;
			}

			set
			{
				switch (value)
				{
					case BonusesViewType.ByDepartments:
					{
						_ParamValue = BonusesViewType.ByDepartments;
					}
					break;

					default:
					{
						_ParamValue = BonusesViewType.ForEmployees;
					}
					break;
				}
			}
		}

		public override void GetFromRequest (HttpRequestBase aR)
		{
			Object V = aR.Params[this.ParamID];
			String P = ((V != null) && (V is String)) ? (String) V : null;

			///   Выходим в двух случаях: либо в коллекции Params нет такого ключа
			///   (то есть, в страницу не пришел нужный аргумент вообще), либо если 
			///   такой ключ есть, но, по какому-то странному стечению обстоятельств, 
			///   связанное значение по этому ключу равно Null. 
			if (P == null) return;

			///   Считываем текстовый литерал, как значение из веб-запроса. 

			///   Известно, что C# оптимизирован для сравнения больших символов в строках, 
			///   поэтому для сравнения строк, превращаем в UpperCase, а не в LowerCase. 
			P = P.ToUpperInvariant();

			if (P == ValueTextLiteral_ByDepartments)
				this.ParamValue = BonusesViewType.ByDepartments;
			else
				this.ParamValue = BonusesViewType.ForEmployees;
		}

		public override String GetValueFor (BonusesViewType aOtherValue)
		{
			String TextValue = ValueTextLiteral_ForEmployees;

			switch (aOtherValue)
			{
				case BonusesViewType.ByDepartments: TextValue = ValueTextLiteral_ByDepartments; break;
			}

			return TextValue;
		}
	}



	///   С помощью подобной структуры я привык обрабатывать и проверять на валидность 
	///   данные, которые передаются в веб-запросе. 
	public class BonusesViewParams : ViewParams
	{
		public BonusesViewParam		ViewType		= new BonusesViewParam	("viewtype", BonusesViewType.ForEmployees);
		public MoneyViewParam		ReportBonusSum	= new MoneyViewParam	("reportsum", 100000.00M);

		public BonusesViewParams (HttpRequestBase aR) : base (aR)
		{
			ViewType		.GetFromRequest(aR);
			ReportBonusSum	.GetFromRequest(aR);
		}
	}
}

